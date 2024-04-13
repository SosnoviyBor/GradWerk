from fastapi import APIRouter, Request
from queue import PriorityQueue

from modeler.model import Model
from modeler.components.create import Create
from modeler.components.process import Process
from modeler.components.dispose import Dispose
from modeler.utils.consts import DistributionType


router = APIRouter()


@router.post("/simulate")
async def simulate(request: Request):
    data = await request.json()
    model = data["model"]["drawflow"]["Home"]["data"]
    simtime = data["simtime"]
    
    elements = create_elements(model)
    print(elements)
    
    return model

def create_elements(model: list) -> list:
    # initialize elements
    elements = []
    for key in model.keys():
        data = model[key]["data"]
        match model[key]["class"]:
            case "userinput":
                if not has_connections(model[key], False): break
                
                element = Create(data["delay"], data["replica"])
                element.name = data["name"]
                element.distribution = parse_dist(data["dist"])
                element.delay_deviation = data["deviation"]
            
            case "useroutput":
                if not has_connections(model[key], True): break
                
                element = Dispose()
                element.name = data["name"]
            
            
            case "frontend", "backend", "database":
                if (not has_connections(model[key], True)
                    or not has_connections(model[key], False)): break
                
                element = Process(data["delay"], data["replica"])
                element.name = data["name"]
                element.distribution = parse_dist(data["dist"])
                element.delay_deviation = data["deviation"]
                element.max_queue = data["queuesize"]
            
            
            case _:
                break
        elements.append(element)
    
    # chain elements
    
    return elements

def parse_dist(dist_name: str) -> int:
    match dist_name:
        case "exponential": return DistributionType.exponential
        case "normal": return DistributionType.normal
        case "erlang": return DistributionType.erlang
        case "uniform": return DistributionType.uniform
        case _: raise(f"Recieved unknow distribution type {dist_name}!")

def has_connections(data: dict, is_input: bool) -> bool:
    if is_input: conn_type = "inputs"
    else: conn_type = "outputs"
    
    connections = data[conn_type]
    for key in connections.keys():
        if connections[key]:
            return True
    return False