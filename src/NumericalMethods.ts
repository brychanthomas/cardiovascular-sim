export class NumericalMethods {

    static d_dt(func:(t: number)=>number, t: number) {
        let epsilon = 1e-6;
        let delta = func(t+epsilon)-func(t-epsilon);
        return delta / (2*epsilon);
    }

    static RungeKutta4(f:(y:number, p:number)=>number, timespan:number, h:number, p0: number) {
        //https://jurasic.dev/ode/
        let ps = [p0];
        let ts = [0];
        for (let i = 0; i < timespan/h; i++) {
            const k1 = f(ts[i], ps[i])
            
            const s1 = ps[i] + k1 * h/2
            const k2 = f(ts[i] + h/2, s1)
            
            const s2 = ps[i] + k2 * h/2
            const k3 = f(ts[i] + h/2, s2) 
            
            const s3 = ps[i] + k3 * h
            const k4 = f(ts[i] + h, s3) // f(t + h, y_n + k3*h)
            ps.push(ps[i] + (k1/6 + k2/3 + k3/3 + k4/6) * h);
            ts.push(ts[i]+h);
        }
        return [ts, ps]
    }

    static TrapezoidalIntegration(f:(t: number)=>number, timespan: number, samples: number) {
        var h = timespan/samples;
        var area = 0;
        for (var i=0; i<samples; i++) {
            let x0 = h * i;
            let x1 = h * (i+1);
            area += 0.5 * h * (f(x0) + f(x1));
        }
        return area;
    }
}