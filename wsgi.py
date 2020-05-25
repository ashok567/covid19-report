from app.main import make_app
import tornado.ioloop
import os


port = int(os.environ.get("PORT", 9005))
if __name__ == "__main__":
    print("Server is running at "+str(port))
    app = make_app()
    app.listen(port)
    tornado.ioloop.IOLoop.current().start()
