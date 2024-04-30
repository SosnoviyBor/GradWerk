from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

from routers.utils.result_decoder import decode


router = APIRouter()

templates = Jinja2Templates(directory="templates")


@router.get("/")
async def index(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", context={}
    )


@router.post("/result")
async def result(request: Request):
    data = decode(await request.body())
    
    return templates.TemplateResponse(
        request=request, name="result.html", context={ "result": data }
    )