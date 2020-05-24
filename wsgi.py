from app.main import make_app
import tornado.ioloop

port = 9005
if __name__ == "__main__":
    print("Server is running at "+str(port))
    app = make_app()
    app.listen(port)
    tornado.ioloop.IOLoop.current().start()
