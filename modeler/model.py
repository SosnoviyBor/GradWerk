from typing import List
from sys import maxsize

from modeler.components.element import Element
from modeler.components.create import Create
from modeler.components.process import Process
from modeler.components.dispose import Dispose

class Model:
    def __init__(self, elements: List[Element]) -> None:
        self.elements = elements
        
        self.tnext = .0
        self.tcurr = self.tnext
    
    
    def simulate(self, time: float, do_output: bool) -> None:
        print(f"There are {len(self.elements)} elements in the simulation")
        
        while self.tcurr < time:
            # searching nearest event
            self.tnext = maxsize
            event_id = 0
            for element in self.elements:
                if element.get_tnext() < self.tnext:
                    self.tnext = element.get_tnext()
                    event_id = element.id

            # print output maybe?
            if do_output:
                print(("\n"
                    f">>>     Event in {self.elements[event_id].name}    <<<\n"
                    f">>>     time: {round(self.tnext, 4)}    <<<"))
            
            # update current time of each element + calculate some stats
            tcurr_old = self.tcurr
            self.tcurr = self.tnext
            for element in self.elements:
                element.do_statistics(self.tnext - tcurr_old)
                element.tcurr = self.tcurr
            
            # move things between relevant elements queues
            self.elements[event_id].out_act()
            for element in self.elements:
                if element.get_tnext() == self.tcurr:
                    element.out_act()

            # print all element info maybe?
            if do_output:
                for element in self.elements:
                    element.print_full_info()
        
        if do_output:
            self.print_simulation_results()
        print("Simulation is done successfully!")
        
        return self.collect_data()
    
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
    
    
    def collect_data(self) -> list:
        """
        returns: [{
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
        model_data = []
        for element in self.elements:
            element_data = {
                "id": element.id,
                "name": element.name
            }
            if isinstance(element, Create):
                element_data["mean"] = element.delay_mean
                element_data["worker_count"] = element.worker_count
                element_data["distribution"] = element.distribution
                element_data["deviation"] = element.delay_deviation
                
            elif isinstance(element, Process):
                element_data["mean"] = element.delay_mean
                element_data["worker_count"] = element.worker_count
                element_data["distribution"] = element.distribution
                element_data["deviation"] = element.delay_deviation
                element_data["max_queue"] = element.max_queue
                
            elif isinstance(element, Dispose):
                pass
            
            
            element_result = {
                "quantity": element.quantity
            }
            if isinstance(element, Create):
                pass
                
            if isinstance(element, Process):
                element_result["failures"] = element.failure
                element_result["mean_queue_length"] = element.mean_queue / self.tcurr
                element_result["failure_probability"] = element.failure / (element.failure + element.quantity)
                
            elif isinstance(element, Dispose):
                pass
            
            
            model_data.append({
                "data": element_data,
                "result": element_result
            })
            
        return model_data