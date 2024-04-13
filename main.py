from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routers.index import router as index_router
from routers.simulator import router as simulator_router


app = FastAPI()

app.include_router(index_router)
app.include_router(simulator_router)
app.mount("/static", StaticFiles(directory="static"), name="static")