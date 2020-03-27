from tornado.web import RequestHandler, Application
import tornado.ioloop
import os
import json


class MainHandler(RequestHandler):
    def get(self):
        self.render("index.html")


settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), 'templates'),
    # static_path=os.path.join(os.path.dirname(__file__), 'static'),
    debug=True
)


def make_app():
    return Application(
        [
        (r'/', MainHandler),
            (r'/(.*)', tornado.web.StaticFileHandler,
             {"path": ""})], **settings)


port = 9005
if __name__ == '__main__':
    print("Server is running at "+str(port))
    app = make_app()
    app.listen(port)
    tornado.ioloop.IOLoop.current().start()
