from queue import PriorityQueue
from sys import maxsize

from modeler.utils.consts import DistributionType, NextElementType
from modeler.utils.random_gens import *


class Element:
    next_id = 0
    
    def __init__(self, delay: float, worker_count: int) -> None:
        self.worker_count = worker_count
        self.delay_mean = delay
        
        self.id = Element.next_id
        Element.next_id += 1
        self.name = f"element{self.id}"
        
        self.name = "Anonymous"
        self.tnext = PriorityQueue()
        self.delay_deviation = .0
        self.k = 0 # used only in erlang()
        self.distribution = DistributionType.exponential
        self.next_element_type = NextElementType.single
        self.tcurr = .0
        self.state = 0
        self.queue = 0 # amount of tnexts
        self.quantity = 0
        self.average_load = 0
        
        self.next_element: Element
        self.next_element_queue: PriorityQueue
        self.next_element_array: list
        # self.next_element_typed_array: dict
    
    
    @staticmethod
    def refresh_next_id() -> None:
        Element.next_id = 0
    
    
    def get_delay(self) -> float:
        match(self.distribution):
            case DistributionType.exponential:
                return exponential(self.delay_mean)
            case DistributionType.normal:
                return normal(self.delay_mean, self.delay_deviation)
            case DistributionType.uniform:
                return uniform(self.delay_mean, self.delay_deviation)
            case DistributionType.erlang:
                return erlang(self.delay_mean, self.k)
            case _:
                return self.delay_mean
    
    
    def get_tnext(self) -> float:
        return self.tnext.queue[0]
    
    
    def set_next_element(self, next_element: "Element") -> None:
        self.next_element = next_element
        self.next_element_type = NextElementType.single
    
    
    def set_next_element_queue(self, next_element_queue: PriorityQueue) -> None:
        self.next_element_type = NextElementType.queue
        self.next_element_queue = next_element_queue
    
    
    def set_next_element_random(self, next_element_array: list) -> None:
        self.next_element_type = NextElementType.random
        self.next_element_array = next_element_array
    
    
    def set_next_element_typed_array(self, next_element_typed_array: dict) -> None:
        self.next_element_type = NextElementType.queue
        self.next_element_typed_array = next_element_typed_array
    
    
    def in_act(self) -> None:
        pass
    
    
    def out_act(self) -> None:
        self.quantity += 1
    
    
    def do_statistics(self, delta: float) -> None:
        pass
    
    
    def put_tnext(self, tnext: float) -> None:
        self.tnext.put(tnext)
    
    
    def pop_tnext_from_queue(self) -> float:
        return self.tnext.get()
    
    
    def print_result(self) -> None:
        print(f"{self.name} quantity = {self.quantity}")
    
    
    def print_full_info(self, failure: str = "") -> None:
        from .dispose import Dispose
        
        nearest_tnext: float = self.get_tnext()
        msg = f"\n##### {self.name} #####\n"
        
        if nearest_tnext != maxsize:
            self.average_load = self.quantity / nearest_tnext
        
        if isinstance(self, Dispose):
            msg += f"quantity: {self.quantity}"
        else:
            msg += (
                f"state: {self.state} | "
                f"quantity: {self.quantity} | "
                f"queue: {self.queue} | "
                f"tnext: {round(nearest_tnext, 4)} | "
                f"average_load: {self.average_load}"
            )
        msg += failure
        
        print(msg)