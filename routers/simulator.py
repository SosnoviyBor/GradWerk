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
    elements_by_id = {}
    for key in model.keys():
        data = model[key]["data"]
        match model[key]["class"]:
            case "userinput":
                if not has_connections(model[key], False): break
                
                element = Create(data["mean"], data["replica"])
                element.name = data["name"]
                element.distribution = parse_dist(data["dist"])
                element.delay_deviation = data["deviation"]
            
            case "useroutput":
                if not has_connections(model[key], True): break
                
                element = Dispose()
                element.name = data["name"]
            
            
            case "frontend" | "backend" | "database":
                if (not has_connections(model[key], True)
                    and not has_connections(model[key], False)): break
                
                element = Process(data["mean"], data["replica"])
                element.name = data["name"]
                element.distribution = parse_dist(data["dist"])
                element.delay_deviation = data["deviation"]
                element.max_queue = data["queuesize"]
            
            
            case _:
                break
        elements_by_id[key] = element
    
    """ chain elements
    model {
        id {
            outputs {
                output_id {
                    connections [
                        [
                            node: int   # element id
                            output: str # in which input of element it goes
                        ]
                    ]
                }
            }
        }
    }
    """
    for element_id in model.keys():
        element_info = model[element_id]
        element_obj = elements_by_id[element_id]
        
        match element_info["data"]["order"].lower():
            case "top to bottom":
                q = PriorityQueue()
                # its a mess, i know
                outputs = element_info["outputs"]
                for output_id in len(outputs):
                    connections = element_info["outputs"][output_id]["connections"]
                    for connection in connections:
                        q.put((output_id, elements_by_id[connection["node"]]))
                        
                element_obj.set_next_element_queue(q)
            
            case "random":
                pass
            
            case _:
                raise(f"Recieved unknown element order {element_info['data']['order']}!")
    
    return [elements_by_id[key] for key in elements_by_id.keys()]

def parse_dist(dist_name: str) -> int:
    match dist_name:
        case "exponential": return DistributionType.exponential
        case "normal": return DistributionType.normal
        case "erlang": return DistributionType.erlang
        case "uniform": return DistributionType.uniform
        case _: raise(f"Recieved unknown distribution type {dist_name}!")

def has_connections(data: dict, is_input: bool) -> bool:
    if is_input: conn_type = "inputs"
    else: conn_type = "outputs"
    
    connections = data[conn_type]
    for key in connections.keys():
        if connections[key]["connections"]:
            return True
    return False