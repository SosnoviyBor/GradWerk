from sys import maxsize

from modeler.components.element import Element
from modeler.utils import shortcuts


class Process(Element):
    def __init__(self, delay: float, worker_count: int) -> None:
        super().__init__(delay, worker_count)
        self.max_queue = maxsize
        self.mean_queue = .0
        self.wait_start = .0
        self.wait_time = .0
        self.failure = 0
        self.state_sum = 0
        self.put_tnext(maxsize)
    
    
    def in_act(self) -> None:
        if self.state < self.worker_count:
            self.state += 1
            self.put_tnext(self.tcurr + self.get_delay())
            if self.state == 0:
                self.wait_time += self.tcurr - self.wait_start
        else:
            if self.queue < self.max_queue:
                self.queue += 1
            else:
                self.failure += 1
    
    
    def out_act(self) -> None:
        super().out_act()
        self.state -= 1
        if self.queue > 0:
            self.queue -= 1
            self.state += 1
            self.put_tnext(self.tcurr + self.get_delay())
        else:
            self.wait_start = self.tcurr
        shortcuts.out_act(self)
        self.pop_tnext_from_queue()
    
    
    def print_full_info(self) -> None:
        super().print_full_info(f"\nfailure: {self.failure}")
    
    
    def do_statistics(self, delta: float) -> None:
        self.state_sum += delta * self.state
        self.mean_queue += self.queue * delta