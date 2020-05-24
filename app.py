from tornado.web import RequestHandler, Application
import tornado.ioloop
import os
import json
import etl


class MainHandler(RequestHandler):
    def get(self):
        self.render("index.html")


class StatewiseHandler(RequestHandler):
    def get(self):
        res = etl.statewise_count()
        self.write({'response': json.loads(res)})


class DatewiseHandler(RequestHandler):
    def get(self):
        res = etl.time_series()
        self.write({'response': json.loads(res)})


class PieHandler(RequestHandler):
    def get(self):
        res = etl.pie_data()
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
         (r'/time_series', DatewiseHandler),
         (r'/pie', PieHandler),
         (r'/(.*)', tornado.web.StaticFileHandler,
          {"path": ""})], **settings)


port = 9005
if __name__ == '__main__':
    print("Server is running at "+str(port))
    app = make_app()
    app.listen(port)
    tornado.ioloop.IOLoop.current().start()
