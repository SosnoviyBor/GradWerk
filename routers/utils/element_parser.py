from queue import PriorityQueue
from typing import List

from modeler.components.element import Element
from modeler.components.create import Create
from modeler.components.process import Process
from modeler.components.dispose import Dispose
from modeler.utils.consts import DistributionType

def create_elements(model: dict) -> List[Element]:
    """
    Parse request data into ready-to-simulate list of element objects
    
    model {
        (element)id {
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
    # reset element id count
    Element.next_id = 0
    # dict for logical linking of input element data and newly created element objects
    elements_by_id = {}
    # initialize elements
    for element_id in model.keys():
        if not _is_valid_element(model[element_id]): continue
        data = model[element_id]["data"]
        # create element based on its class
        match model[element_id]["class"]:
            case "userinput":
                element = Create(float(data["mean"]), int(data["replica"]))
                element.name = data["name"]
                element.distribution = _parse_dist(data["dist"])
                element.delay_deviation = float(data["deviation"])
                element.k = float(data["deviation"])
            
            case "useroutput":
                element = Dispose()
                element.name = data["name"]
            
            case "frontend" | "backend" | "database":
                element = Process(float(data["mean"]), int(data["replica"]))
                element.name = data["name"]
                element.distribution = _parse_dist(data["dist"])
                element.delay_deviation = float(data["deviation"])
                element.k = float(data["deviation"])
                element.max_queue = int(data["queuesize"])
            
            case _:
                raise(f"Recieved unknown element class: {model[element_id]['class']}")
        elements_by_id[element_id] = element
    
    # chain elements together
    # from output to input
    for element_id in model.keys():
        if not _is_valid_element(model[element_id]): continue
        # info on current element thats being iterated
        element_info = model[element_id]
        # current element itself
        element_obj = elements_by_id[element_id]
        
        # check if element is supposed to have outputs
        if isinstance(element_obj, Dispose): continue
        
        # TODO update it to support balanced, round robin and random
        match element_info["data"]["order"].lower():
            case "top to bottom":
                element_obj.set_next_element_queue(
                    _parse_next_element(PriorityQueue(), element_info, elements_by_id))
            
            case "random":
                element_obj.set_next_element_random(
                    _parse_next_element(list(), element_info, elements_by_id))
            
            case _:
                raise(f"Recieved unknown element order: {element_info['data']['order']}")
    
    return [elements_by_id[key] for key in elements_by_id.keys()]

def _has_connections(element: dict, is_input: bool) -> bool:
    """Check for having ANY connections from certain side"""
    connections = element["inputs" if is_input else "outputs"]
    for key in connections.keys():
        if connections[key]["connections"]:
            return True
    return False

def _is_valid_element(element: dict) -> bool:
    """Shortcut for _hase_connection() function"""
    if element["inputs"] and element["outputs"]:    return _has_connections(element, True) and _has_connections(element, False)
    elif element["inputs"]:                         return _has_connections(element, True)
    elif element["outputs"]:                        return _has_connections(element, False)
    else:                                           return False

def _parse_dist(dist_name: str) -> int:
    """Parse distributions from name to standart DistributionType values"""
    match dist_name:
        case "exponential": return DistributionType.exponential
        case "normal":      return DistributionType.normal
        case "erlang":      return DistributionType.erlang
        case "uniform":     return DistributionType.uniform
        case _:             raise(f"Recieved unknown distribution type {dist_name}!")

def _parse_next_element(collection:     list | PriorityQueue,
                        element_info:   dict,
                        elements_by_id: dict) -> list | PriorityQueue:
    """Fill provided collection with elements to make next element lists"""
    # from output to input
    outputs = element_info["outputs"]
    # elements may have multiple outputs
    for output_id in range(1, len(outputs)+1):
        connections = outputs[f"output_{output_id}"]["connections"]
        # each output may have multiple connections
        for connection in connections:
            if isinstance(collection, list):
                collection.append(elements_by_id[connection["node"]])
                
            elif isinstance(collection, PriorityQueue):
                pair = (output_id, elements_by_id[connection["node"]])
                collection.put(pair)
                
            else:
                raise(f"Recieved unknown collection type: {type(collection)}")

    return collection