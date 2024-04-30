from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routers.pages import router as page_router
from routers.simulator import router as simulator_router


app = FastAPI()

app.include_router(page_router)
app.include_router(simulator_router)
app.mount("/static", StaticFiles(directory="static"), name="static")