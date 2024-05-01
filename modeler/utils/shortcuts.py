from random import choice

from modeler.utils.consts import NextElementType
from modeler.components.element import Element

def out_act(e: Element) -> None:
    match(e.next_element_type):
        case NextElementType.single:
            e.next_element.in_act()
            
        case NextElementType.queue:
            # sadly, theres no such method as peek() for queues here :(
            next_element: Element = e.next_element_queue.get()[1]
            next_element.in_act()
            # put element back
            e.next_element_queue.put(
                (next_element.get_tnext(), next_element)
            )
            
        case NextElementType.random:
            next_element: Element = choice(e.next_element_array)
            next_element.in_act()
            
        case _:
            raise(f"Recieved unknown next element type: {e.next_element_type}")