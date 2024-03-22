from fastapi import FastAPI

from routers.index import router as index_router


app = FastAPI()

app.include_router(index_router)