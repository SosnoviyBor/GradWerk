from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

from routers.utils.element_parser import create_elements
from modeler.model import Model


router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.post("/simulate")
async def simulate(request: Request):
    data = await request.json()
    # full structure of model can be checked in /premade_flowcharts/basic.json
    model = data["model"]
    simtime = float(data["simtime"])
    log_max_size = int(data["log_max_size"])
    assert simtime > 0
    
    elements = create_elements(model)
    print("Modeling started!")
    simdata = Model(elements).simulate(simtime, log_max_size)
    print("Modeling ended!")
    
    return simdata