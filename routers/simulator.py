from fastapi import APIRouter, Request

from utils.element_parser import create_elements
from modeler.model import Model


router = APIRouter()


@router.post("/simulate")
async def simulate(request: Request):
    data = await request.json()
    model = data["model"]["drawflow"]["Home"]["data"]
    simtime = data["simtime"]
    
    elements = create_elements(model)
    print(elements)
    
    return model