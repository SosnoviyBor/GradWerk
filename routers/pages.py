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


@router.post("/results")
async def results(request: Request):
    data = decode(await request.body())
    print(data)
    
    # its dumb and stupid but  r e a d a b i l i t y
    ctx = {
        "results": data["results"],
        "log": data["log"]
    }
    return templates.TemplateResponse(request=request, name="results.html", context=ctx)