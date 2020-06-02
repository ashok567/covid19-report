import pandas as pd
import requests
from io import BytesIO
import yaml
import datetime as dt


with open('app/config.yml', 'r') as config_file:
    try:
        config = yaml.safe_load(config_file)
    except yaml.YAMLError as exc:
        print(exc)


# response = requests.get(config['url'])
state_response = requests.get(config['state_wise'])
district_response = requests.get(config['district_wise'])
time_series_response = requests.get(config['case_time_series'])
test_response = requests.get(config['statewise_tested_numbers_data'])


def statewise_count():
    statewise_data = state_response.content
    statewise_df = pd.read_csv(BytesIO(statewise_data), encoding='utf-8')
    statewise_df = statewise_df.rename(columns={'State': 'Location'})
    statewise_df = statewise_df.drop(['State_Notes'], axis=1)
    statewise_df['Delta_Total'] = statewise_df['Delta_Confirmed']
    + statewise_df['Delta_Recovered'] + statewise_df['Delta_Deaths']
    statewise_df = statewise_df.to_json(orient='records')
    return statewise_df


def districtwise_count(state):
    districtwise_data = district_response.content
    districtwise_df = pd.read_csv(BytesIO(districtwise_data), encoding='utf-8')
    districtwise_df = districtwise_df[
        districtwise_df['State'] == state.strip()]
    districtwise_df = districtwise_df.drop(['SlNo', 'District_Notes'], axis=1)
    districtwise_df = districtwise_df.rename(
        columns={'Deceased': 'Deaths', 'Delta_Deceased': 'Delta_Deaths',
                 'District': 'Location'})
    districtwise_df['Delta_Total'] = districtwise_df['Delta_Confirmed']
    + districtwise_df['Delta_Recovered'] + districtwise_df['Delta_Deaths']
    districtwise_df = districtwise_df.to_json(orient='records')
    return districtwise_df


def time_series():
    time_series_data = time_series_response.content
    daily_df = pd.read_csv(BytesIO(time_series_data), encoding='utf-8')
    daily_df['Date'] = daily_df['Date'].str.strip()
    daily_df['Month'] = daily_df['Date'].apply(
        lambda x: x.split(' ')[1])
    daily_df = daily_df.fillna(0)
    daily_df = daily_df.drop('Date', axis=1)
    daily_df = daily_df.groupby('Month').sum().reset_index()

    test_data = test_response.content
    test_df = pd.read_csv(BytesIO(test_data), encoding='utf-8')
    test_df = test_df.dropna(subset=['Tag (Total Tested)'])
    test_df['Updated On'] = test_df['Updated On'].str.strip()
    test_df = test_df[['Updated On', 'Total Tested']]
    test_df = test_df.groupby('Updated On').sum().reset_index()
    test_df['Month'] = test_df['Updated On'].apply(
        lambda x: dt.datetime.strftime(
            dt.datetime.strptime(str(x), '%d/%m/%Y'), '%m'))
    test_df = test_df.fillna(0)
    test_df = test_df.drop('Updated On', axis=1)
    test_df = test_df.groupby('Month').max().reset_index()
    test_df = test_df.sort_values(by='Month')
    test_df['Total Tested'] = test_df['Total Tested'].diff().fillna(
        test_df['Total Tested'])
    test_df['Month'] = test_df['Month'].apply(
        lambda x: dt.datetime.strftime(
            dt.datetime.strptime(str(x), '%m'), '%B'))

    merged_df = daily_df.merge(test_df, how='left', on='Month')
    merged_df['Month'] = pd.to_datetime(
            merged_df.Month, format='%B').dt.month
    merged_df = merged_df[['Month', 'Total Tested', 'Daily Confirmed',
                          'Daily Recovered', 'Daily Deceased']]
    merged_df = merged_df.sort_values(by='Month')
    merged_df = merged_df.fillna(0)
    merged_df = merged_df[merged_df['Month'] != int(
        dt.datetime.strftime(dt.datetime.now(), '%m'))]
    merged_df = merged_df.to_json(orient='records')
    return merged_df


def pie_data():
    pie_data = test_response.content
    pie_df = pd.read_csv(BytesIO(pie_data), encoding='utf-8')
    pie_df = pie_df.dropna(subset=['Tag (Total Tested)'])
    pie_df['Updated On'] = pie_df['Updated On'].str.strip()
    pie_df['Updated On'] = pd.to_datetime(pie_df['Updated On'], dayfirst=True)
    pie_df = pie_df.sort_values(by='Updated On', ascending=False)
    cols = ['Positive', 'Negative', 'Unconfirmed',
            'Total People Currently in Quarantine',
            'Total People Released From Quarantine']
    new_pie_df = pie_df.groupby('Updated On', sort=False).sum().reset_index()
    new_pie_df = new_pie_df[cols].iloc[0].fillna(0)
    return new_pie_df.to_json(orient='columns')


def spark_data():
    trend_data = time_series_response.content
    trend_df = pd.read_csv(BytesIO(trend_data), encoding='utf-8')
    trend_df['Date'] = trend_df['Date'].str.strip()
    trend_df = trend_df.fillna(0)
    trend_df['Daily Active'] = trend_df['Total Confirmed'] - trend_df[
        'Daily Recovered'] - trend_df['Daily Deceased']
    cols = ['Date', 'Daily Confirmed', 'Daily Active',
            'Daily Recovered', 'Daily Deceased']
    trend_df = trend_df[cols].tail(30)
    return trend_df.to_json(orient='records')
