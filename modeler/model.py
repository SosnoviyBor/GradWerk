from typing import List
from sys import maxsize

from modeler.components.element import Element
from modeler.components.process import Process

class Model:
    def __init__(self, elements: List[Element]) -> None:
        self.elements = elements
        
        self.tnext = .0
        self.tcurr = self.tnext
    
    
    def simulate(self, time: float, do_output: bool) -> None:
        print(f"There are {len(self.elements)} elements in the simulation")
        
        while self.tcurr < time:
            # if this will be required
            # here sould be implemented swap threshold feature
            # otherwise, remove Element.swap_threshold
            
            # searching nearest event
            self.tnext = maxsize
            event_id = 0
            for element in self.elements:
                if element.get_tnext() < self.tnext:
                    self.tnext = element.get_tnext()
                    event_id = element.id
            
            # print output maybe?
            if do_output:
                print((
                        "\n"
                        f">>>     Event in {self.elements[event_id].name}    <<<\n"
                        f">>>     time: {round(self.tnext, 4)}    <<<"
                ))
            
            # update current time of each element + show statistics
            tcurr_old = self.tcurr
            self.tcurr = self.tnext
            for element in self.elements:
                element.do_statistics(self.tnext - tcurr_old)
                element.tcurr = self.tcurr
            
            self.elements[event_id].out_act()
            for element in self.elements:
                if element.get_tnext() == self.tcurr:
                    element.out_act()

            if do_output:
                self.call_elements_print_info()
        
        if do_output:
            self.print_simulation_results()
    
    
    def call_elements_print_info(self) -> None:
        for element in self.elements:
            element.print_full_info()
    
    
    def print_simulation_results(self) -> None:
        print("\n-------------RESULTS-------------")
        for element in self.elements:
            element.print_result()
            if isinstance(element, Process):
                print(
                    f"Mean length of queue = {element.mean_queue / self.tcurr}\n"
                    f"Failure probability = {element.failure / (element.failure + element.quantity)}\n"
                )
            else:
                print()