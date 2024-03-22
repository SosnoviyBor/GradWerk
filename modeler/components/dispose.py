from sys import maxsize

from .element import Element
from ..utils import shortcuts

class Dispose(Element):
    def __init__(self) -> None:
        super().__init__(0, 0, maxsize)
        self.put_tnext(maxsize)
    
    
    def in_act(self) -> None:
        self.out_act()
    
    
    def out_act(self) -> None:
        super().out_act()
        # shortcuts.out_act(self)