#!/usr/bin/env python3

import math
import sys

# a ** b % c
def quick_mod(a, b, c):
    a %= c
    r = 1
    while b != 0:
        # 用倍加算法拆分 b，位是 1 就乘到 r 上
        if b & 1:
            r = (r * a) % c
        a = (a * a) % c
        b >>= 1
    return r

# 已知正整数 x, 奇质数 p，(1 <= x < p)，求是否存在 y，满足 y * y = x % p
# 勒让德符号为 1，欧拉（Euler）判别法
def has_mod_sqrt(x, p):
    return 1 == quick_mod(x, (p - 1) // 2, p)

# 模平方根的解法——托内利－尚克斯算法（Tonelli–Shanks algorithm）
# https://sumygg.com/2013/07/28/tonellishanks-algorithm/
def get_mod_sqrt(x, p):
    if has_mod_sqrt(x, p):
        t = 0
        s = p - 1  # p - 1 = 2^t * s, s 是奇数
        while s & 1 == 0:
            s >>= 1
            t += 1
        if t == 1:
            ret = quick_mod(x, (s + 1) // 2, p)
            return (ret, p - ret)
        elif t >= 2:
            x_ = quick_mod(x, p - 2, p)
            n = 1
            while has_mod_sqrt(n, p):
                n += 1
            b = quick_mod(n, s, p)
            ret = quick_mod(x, (s + 1) // 2, p)  # t - 1
            t_ = 0
            while t > 1:
                if quick_mod(x_ * ret * ret, 2 ** (t - 2), p) == 1:
                    ret = ret
                else:
                    ret = ret * (b ** (2 ** t_)) % p
                t -= 1
                t_ += 1
            return (ret, p - ret)
        else:
            return (-2, -2)
    else:
        return (-1, -1)

def get_y_by_x(x):
    p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
    return get_mod_sqrt((x ** 3 + 7) % p, p)

if __name__ == '__main__':
    for i in range(1, len(sys.argv)):
        x = int(sys.argv[i])
        print('[' + str(i) + ']')
        print('  x =', sys.argv[i])
        print('  y =', get_y_by_x(x))
