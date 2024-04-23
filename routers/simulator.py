from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

from routers.utils.element_parser import create_elements
from modeler.model import Model


router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.post("/simulate")
async def simulate(request: Request):
    data = await request.json()
    model = data["model"]["drawflow"]["Home"]["data"]
    simtime = float(data["simtime"])
    assert simtime > 0
    
    elements = create_elements(model)
    results = Model(elements).simulate(simtime, False)
    """
    results [{
        data {
            id: int,
            name: str,
            !mean: float,
            !deviation: float,
            !worker_count: int,
            !distribution: int,
            !max_queue: int
        },
        result {
            quantity: int,
            !failures: int,
            !mean_queue_length: float,
            !failure_probability: float
        }]
    }
    """
    
    # return results
    
    return templates.TemplateResponse(
        request=request, name="index.html", context={}
    )