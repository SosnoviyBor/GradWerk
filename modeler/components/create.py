from sys import maxsize

from modeler.components.element import Element
from modeler.utils import shortcuts

class Create(Element):
    def __init__(self, delay: float, worker_count: int) -> None:
        super().__init__(delay, worker_count, maxsize)
        self.put_tnext(.0)
    
    
    def out_act(self) -> None:
        super().out_act()
        self.put_tnext(self.tcurr + self.get_delay())
        
        shortcuts.out_act(self)
        
        self.pop_tnext_from_queue()