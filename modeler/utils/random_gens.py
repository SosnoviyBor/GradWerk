import random
from math import log


def exponential(mean: float) -> float:
    a = _generate_random_nonzero_value()
    return -mean * log(a)


def uniform(min: float, max: float) -> float:
    a = _generate_random_nonzero_value()
    return -min + a * (max - min)


def normal(mean: float, deviation: float) -> float:
    return mean + deviation * random.gauss()


def erlang(mean: float, k: int) -> float:
    sum = 0
    for _ in range(k):
        sum += _generate_random_nonzero_value()
    return sum


def _generate_random_nonzero_value() -> float:
    rand_val = 0
    while rand_val == 0:
        rand_val = random.random()
    return rand_val