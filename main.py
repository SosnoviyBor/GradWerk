from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routers.index import router as index_router


app = FastAPI()

app.include_router(index_router)
app.mount("/static", StaticFiles(directory="static"), name="static")