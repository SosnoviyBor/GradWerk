from typing import Tuple

from .consts import NextElementType
from ..components.element import Element

def out_act(e: Element) -> None:
    match(e.next_element_type):
        case NextElementType.single:
            e.next_element.in_act()
            
        case NextElementType.queue:
            next_element: Element = e.next_element_queue.get()[1]
            next_element.in_act()
            e.next_element_queue.put(
                (next_element.get_tnext(), next_element)
            )
            # will it work tho?
            
        case NextElementType.typed:
            # TODO implement
            pass