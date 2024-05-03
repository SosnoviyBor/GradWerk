import random
from math import log


def exponential(mean: float) -> float:
    a = _random_nonzero_float()
    return -mean * log(a)


def uniform(min: float, max: float) -> float:
    a = _random_nonzero_float()
    return -min + a * (max - min)


def normal(mean: float, deviation: float) -> float:
    return mean + deviation * random.gauss()


# TODO check for correction
def erlang(mean: float, k: int) -> float:
    sum = 0
    for _ in range(k):
        sum += _random_nonzero_float()
    return sum


def _random_nonzero_float() -> float:
    """Generates floats in range (0; 1)"""
    rand_val = 0
    while rand_val == 0:
        rand_val = random.random()
    return rand_val