from queue import PriorityQueue

from modeler.model import Model
from modeler.components.create import Create
from modeler.components.process import Process
from modeler.components.dispose import Dispose
from modeler.utils.consts import DistributionType


DO_OUTPUT = True
TIME = 500
ELEMENTS = []


def test():
    c = Create(.5, 1)
    c.name = "Create"
    c.distribution = DistributionType.exponential
    c.put_tnext(.1)
    ELEMENTS.append(c)
    
    p1 = Process(1,1,1)
    p1.name = "Line 1"
    p1.max_queue = 4
    p1.distribution = DistributionType.normal
    p1.delay_deviation = .3
    p1.queue = 3
    ELEMENTS.append(p1)
    
    p2 = Process(1,1,1)
    p2.name = "Line 2"
    p2.max_queue = 4
    p2.distribution = DistributionType.normal
    p2.delay_deviation = .3
    p2.queue = 3
    ELEMENTS.append(p2)
    
    d = Dispose()
    d.name = "Dispose"
    ELEMENTS.append(d)
    
    q = PriorityQueue()
    q.put((1, p1))
    q.put((2, p2))
    c.set_next_element_queue(q)
    p1.set_next_element(d)
    p2.set_next_element(d)
    
    Model(ELEMENTS).simulate(TIME, DO_OUTPUT)


if __name__ == "__main__":
    test()