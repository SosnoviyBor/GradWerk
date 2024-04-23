from queue import PriorityQueue
from typing import List

from modeler.components.element import Element
from modeler.components.create import Create
from modeler.components.process import Process
from modeler.components.dispose import Dispose
from modeler.utils.consts import DistributionType

def create_elements(model: list) -> List[Element]:
    """
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
    # initialize elements
    elements_by_id = {}
    for key in model.keys():
        data = model[key]["data"]
        match model[key]["class"]:
            case "userinput":
                if not _has_connections(model[key], False): break
                
                element = Create(float(data["mean"]), int(data["replica"]))
                element.name = data["name"]
                element.distribution = _parse_dist(data["dist"])
                element.delay_deviation = float(data["deviation"])
            
            
            case "useroutput":
                if not _has_connections(model[key], True): break
                
                element = Dispose()
                element.name = data["name"]
            

            case "frontend" | "backend" | "database":
                if (not _has_connections(model[key], True)
                    and not _has_connections(model[key], False)): break
                
                element = Process(float(data["mean"]), int(data["replica"]))
                element.name = data["name"]
                element.distribution = _parse_dist(data["dist"])
                element.delay_deviation = float(data["deviation"])
                element.max_queue = int(data["queuesize"])
            
            
            case _:
                break
        elements_by_id[key] = element
    
    # chain elements
    for element_id in model.keys():
        element_info = model[element_id]
        element_obj = elements_by_id[element_id]
        
        if isinstance(element_obj, Dispose): continue
        
        match element_info["data"]["order"].lower():
            case "top to bottom":
                element_obj.set_next_element_queue(_parse_next_element(PriorityQueue(), element_info, elements_by_id))
            
            case "random":
                element_obj.set_next_element_random(_parse_next_element(list(), element_info, elements_by_id))
            
            case _:
                raise(f"Recieved unknown element order {element_info['data']['order']}!")
    
    return [elements_by_id[key] for key in elements_by_id.keys()]

def _parse_dist(dist_name: str) -> int:
    match dist_name:
        case "exponential": return DistributionType.exponential
        case "normal": return DistributionType.normal
        case "erlang": return DistributionType.erlang
        case "uniform": return DistributionType.uniform
        case _: raise(f"Recieved unknown distribution type {dist_name}!")

def _has_connections(data: dict, is_input: bool) -> bool:
    if is_input: conn_type = "inputs"
    else: conn_type = "outputs"
    
    connections = data[conn_type]
    for key in connections.keys():
        if connections[key]["connections"]:
            return True
    return False

def _parse_next_element(collection:     list | PriorityQueue,
                        element_info:   dict,
                        elements_by_id: dict) -> list | PriorityQueue:
    outputs = element_info["outputs"]
    for output_id in range(len(outputs)):
        connections = element_info["outputs"][f"output_{output_id+1}"]["connections"]
        for connection in connections:
            if isinstance(collection, list):
                collection.append(elements_by_id[connection["node"]])
                
            elif isinstance(collection, PriorityQueue):
                pair = (output_id, elements_by_id[connection["node"]])
                collection.put(pair)
                
            else:
                raise(f"Recieved unknown collection type: {type(collection)}")

    return collection