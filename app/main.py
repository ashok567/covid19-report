from tornado.web import RequestHandler, Application
import tornado.ioloop
import os
import json
import app.etl as etl


class MainHandler(RequestHandler):
    def get(self):
        self.render("index.html")


class StatewiseHandler(RequestHandler):
    def get(self):
        res = etl.statewise_count()
        self.write({'response': json.loads(res)})


class DistrictwiseHandler(RequestHandler):
    def get(self):
        state = self.get_argument("state", "")
        res = etl.districtwise_count(state)
        self.write({'response': json.loads(res)})


class DatewiseHandler(RequestHandler):
    def get(self):
        res = etl.time_series()
        self.write({'response': json.loads(res)})


class PieHandler(RequestHandler):
    def get(self):
        res = etl.pie_data()
        self.write({'response': json.loads(res)})


class SparkHandler(RequestHandler):
    def get(self):
        res = etl.spark_data()
        self.write({'response': json.loads(res)})


settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), 'templates'),
    # static_path=os.path.join(os.path.dirname(__file__), 'static'),
    debug=True
)


def make_app():
    return Application(
        [
         (r'/', MainHandler),
         (r'/state_wise', StatewiseHandler),
         (r'/district_wise', DistrictwiseHandler),
         (r'/time_series', DatewiseHandler),
         (r'/pie', PieHandler),
         (r'/trendline', SparkHandler),
         (r'/(.*)', tornado.web.StaticFileHandler,
          {"path": ""})], **settings)
