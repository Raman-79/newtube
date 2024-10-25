
export interface Video {
    id: string;
    title: string;
    description?: string;
    url: string| null;
    thumbnailUrl:string |  'https://imgs.search.brave.com/uDemVeZ7FO6qWhTK8WbsNR0LPams9R0ssSb3vCWI4Ts/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mYWtl/aW1nLnBsLzQ0MHgy/MzAvMjgyODI4L2Vh/ZTBkMC8_cmV0aW5h/PTEmdGV4dD1Qcm9i/bGVtPyUyMCUzQzpw/ZXB3Ojk4OTQxMDU3/MjUxNDc1ODY3NiUz/RQ' ;
    userId: string;
    createdAt?: Date;
}