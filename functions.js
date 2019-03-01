
export default gcd = (x, y, s1=1, s2=0, t1=0, t2=1) => {
    let q = Math.floor(x/y),
          s1copy = s1,
           t1copy = t1;
    return (x % y === 0) ? {gcd: y, s: s2, t: t2} : gcd(y, x%y, s1=s2, s2=s1copy-q*s2, t1=t2, t2=t1copy-q*t2);
  }
