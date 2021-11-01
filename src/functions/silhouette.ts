import {get3dDistance} from './3d_Kmeans'

// a(i) - average distance of i to other points in same cluster.
function silhouette_a(cluster: number[][], point: number[]) {
	let sum = 0;

	cluster.forEach(c => {
		sum += get3dDistance(c, point)
	})
	return 1 / (cluster.length - 1) * sum;
}
// b(i) - average distance to nearest other cluster
function silhouette_b(clusters: number[][][], cluster_i: number, point: number[]) {
	let mean_dists: number[] = [];

    clusters.forEach((cluster: any, i: number) => {
		if(i == cluster_i)
			return;
        let sum = cluster.map((pt: number[] )=> get3dDistance(pt, point)).reduce((acc: number, c: number) => acc + c);
        mean_dists.push(1 / cluster.length * sum);
    })
	return Math.min(...mean_dists); // no it's not elegant... TODO
}
// calculate the silhouette score of a data point
function silhouette_i(clusters: any[], i: number, point: number[]) {
	if(clusters[i].length == 1)
		return 0;
	let a = silhouette_a(clusters[i], point),
		b = silhouette_b(clusters, i, point);
	return (b - a) / Math.max(a, b);
}
// calculate the global silhouette score (an average of s(i) over all data points)
export default function silhouette(clusters: any[]) {
	let sum = 0;
	let count = 0;
    if (!Array.isArray(clusters)) return null;
    clusters.forEach((cluster: number[][],i: number) => {
        cluster.forEach((point: number[]) => {
			sum += silhouette_i(clusters, i, point);
			count++;
        })
    })
	return sum / count;
}
 