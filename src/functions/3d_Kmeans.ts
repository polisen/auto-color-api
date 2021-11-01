/* eslint-disable no-param-reassign */
import stat from "./statFunctions";
import silhouette from "./silhouette";

type HSLData = number[][];
type Clusters = number[][][];
type Cluster = number[][];
type Centroids = number[][];
type Point = number[];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

/**
 *
 * @param dataset - colors
 * @param K - number of centroids to get.
 * @returns the positions of the initial centroids.
 */
// * This function can remain virtually the same
const getInitalCentroids = (dataset: HSLData, K: number): Centroids => {
  const arr = [];
  while (arr.length < K) {
    const r = dataset[randomBetween(0, dataset.length)];
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

function getSummedHSL(cluster: Cluster) {
  let sumH: number[] = [],
    sumS: number[] = [],
    sumL: number[] = [];
  cluster.forEach(([h, s, l]: number[]) => {
    sumH.push(h);
    sumS.push(s);
    sumL.push(l);
  });
  return [sumH, sumS, sumL];
}
/**
 * This function takes a cluster and figures out the mean position of each of each datapoint.
 * The return value is the new centroid for the cluster.
 *
 * @param {number[][]} Cluster  - an array of [h,s,l] values;
 * @returns {number} - [meanH,meanS,meanL];
 */
// * 3D Centroid = [x,y,z] = [ median(x[]), median(y[]), median(z[]) ]
function getMeanCentroid(cluster: number[][]): number[] {
  const [sumH, sumS, sumL] = getSummedHSL(cluster);
  return [stat.mean(sumH), stat.mean(sumS), stat.mean(sumL)];
}

/**
 *
 * @param clusters - the current configuration of clusters.
 * @param centroids -
 * @returns
 */
// * This function has been updated.
function getNewCentroids(clusters: Clusters, centroids: Centroids) {
  return centroids.map((c, i) => {
    if (clusters[i]) {
      return getMeanCentroid(clusters[i]);
    } else {
      throw new Error("missing cluster");
    }
  });
}

/**
 * Checks if arrays are the same.
 * @param oC - old centroids
 * @param arr2 - array
 * @returns boolean
 */
// * This function has been updated.
function checkMatrixSameness(oC: Centroids, nC: Centroids) {
  let condition = true;
  oC.every(([oH, oS, oL]: number[], i: number) => {
    let [nH, nS, nL] = nC[i];

    if (oH !== nH || oS !== nS || oL !== nL) {
      condition = false;
      return condition;
    }
    return condition;
  });
  return condition;
}

const powDiff = (dN: number, cN: number) => Math.pow(Math.abs(dN - cN), 2);

export const get3dDistance = (pt1: Point, pt2: Point): number => {
  const [X1, Y1, Z1] = pt1;
  const [X2, Y2, Z2] = pt2;

  return Math.sqrt(powDiff(X1, X2) + powDiff(Y1, Y2) + powDiff(Z1, Z2));
};
/**
 *
 * @param dataset
 * @param centroids
 * @returns
 */
function calculateClusters(dataset: number[][], centroids: number[][]) {
  const clusters: Clusters = [];
  dataset.forEach((d) => {
    // console.debug("datapoint", [dH, dS, dL]);

    const centroidIndex = centroids
      .map((c, i) => {
        return [get3dDistance(d, c), i];
      })
      .sort((a: any, b: any) => a[0] - b[0])[0][1];

    if (!clusters[centroidIndex]) clusters[centroidIndex] = [];
    clusters[centroidIndex].push(d);
  });

  return clusters;
}

interface KMeansInterface {
  dataset: number[][];
  centroids: number[][];
  oldCentroids?: number[][];
  iterations?: number;
  MAX_ITERATIONS?: number;
}
// * This function has been updated.
function KMeansRecurse({
  dataset,
  centroids,
  oldCentroids = [],
  iterations = 1,
  MAX_ITERATIONS = 50,
}: KMeansInterface): number[][][] {
  let clusters = calculateClusters(dataset, centroids);
  oldCentroids = centroids;
  centroids = getNewCentroids(clusters, centroids);
  if (
    iterations >= MAX_ITERATIONS ||
    checkMatrixSameness(centroids, oldCentroids)
  ) {
    return clusters;
  }

  return KMeansRecurse({
    dataset,
    centroids,
    oldCentroids,
    iterations: iterations + 1,
  });
}

function determineOptimalK(results: any) {
  return results
    .map(({ clusters, ...rest }: { clusters: number[][][]; rest: any }) => ({
      clusters,
      ...rest,
      silhouette: silhouette(clusters),
    }))
    .filter((f: any) => f.silhouette)
    .sort((a: any, b: any) => b.silhouette - a.silhouette)[0];
}

/**
 * For each cluster - figure out the variance of each of the dimensions separately then add them together.
 * @param clusters
 * @returns
 */
function getVariance(clusters: Clusters): number {
  return clusters
    .map((c: Cluster) => {
      const [sumH, sumS, sumL] = getSummedHSL(c);
      const [varH, varS, varL] = [
        stat.variance(sumH),
        stat.variance(sumS),
        stat.variance(sumL),
      ];
      return varH + varS + varL;
    })
    .reduce((acc, c) => acc + c);
}

//* This function can be virtually unchanged, just gotta pass datasets around
const KMeans = (dataset: HSLData): number[][] => {
  // console.debug({dataset});
  const results = new Array(dataset.length - 1)
    .fill(0)
    .map((n, K) => {
      const centroids = getInitalCentroids(dataset, K + 1);
      // console.debug({ centroids });
      const clusters = KMeansRecurse({ dataset, centroids });
      // console.debug({ clusters });
      const variance = getVariance(clusters);
      // console.debug({ variance });
      return { variance, centroids, clusters };
    })
    .sort((a: any, b: any) => a.variance - b.variance);
  return determineOptimalK(results).centroids;
};

export default KMeans;
