from sys import maxsize

from modeler.components.element import Element

class Dispose(Element):
    def __init__(self) -> None:
        super().__init__(0, 0)
        self.put_tnext(maxsize)
    
    
    def in_act(self) -> None:
        self.out_act()
    
    
    def out_act(self) -> None:
        super().out_act()