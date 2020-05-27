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
# data = response.content

time_series_response = requests.get(config['case_time_series'])
time_series_data = time_series_response.content
daily_df = pd.read_csv(BytesIO(time_series_data), encoding='utf-8')
daily_df['Date'] = daily_df['Date'].str.strip()
daily_df['Month'] = daily_df['Date'].apply(
    lambda x: x.split(' ')[1])
daily_df = daily_df.fillna(0)
trend_df = daily_df
daily_df = daily_df.drop('Date', axis=1)
daily_df = daily_df.groupby('Month').sum().reset_index()

test_response = requests.get(config['statewise_tested_numbers_data'])
test_data = test_response.content
test_df = pd.read_csv(BytesIO(test_data), encoding='utf-8')
reqd_cols = ['Updated On', 'Total Tested',
             'Total People Currently in Quarantine',
             'Total People Released From Quarantine']
test_df = test_df[reqd_cols]
test_df = test_df.fillna(0)
test_df['Month'] = test_df['Updated On'].apply(
    lambda x: dt.datetime.strftime(
        dt.datetime.strptime(str(x), '%d/%m/%Y'), '%B'))
test_df = test_df.drop('Updated On', axis=1)
test_df = test_df.groupby('Month').sum().reset_index()


def statewise_count():
    response = requests.get(config['state_wise'])
    data = response.content
    statewise_df = pd.read_csv(BytesIO(data), encoding='utf-8')
    statewise_df = statewise_df.drop(
        ['State_Notes'], axis=1)
    statewise_df['Delta_Total'] = statewise_df['Delta_Confirmed']
    + statewise_df['Delta_Recovered'] + statewise_df['Delta_Deaths']
    statewise_df = statewise_df.to_json(orient='records')
    return statewise_df


def time_series():
    merged_df = daily_df.merge(test_df, how='left', on='Month')
    merged_df['Month'] = pd.to_datetime(merged_df.Month, format='%B').dt.month
    merged_df = merged_df.sort_values(by='Month')
    merged_df = merged_df.fillna(0)
    merged_df = merged_df.to_json(orient='records')
    return merged_df


def pie_data():
    merged_df = daily_df.merge(test_df, how='left', on='Month')
    merged_df['Month'] = pd.to_datetime(merged_df.Month, format='%B').dt.month
    merged_df = merged_df.sort_values(by='Month')
    merged_df = merged_df.fillna(0)
    cols = ['Total Confirmed', 'Total Recovered', 'Total Deceased',
            'Total People Currently in Quarantine',
            'Total People Released From Quarantine']
    pie_df = merged_df[cols].sum()
    return pie_df.to_json(orient='columns')


def spark_data():
    global trend_df
    cols = ['Date', 'Daily Confirmed', 'Daily Recovered', 'Daily Deceased']
    trend_df = trend_df[cols]
    trend_df = trend_df.tail(30)
    return trend_df.to_json(orient='records')
