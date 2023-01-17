import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../lib/Api/Api";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { HalfMalf } from "../lib/spinner-loader/index";
import "../lib/spinner-loader/index.css";
import Gmap from "../components/Gmap";

// // Importing Images -------------------------------------------------------------
// import img_ImageNotAvailable from "../assets/images/pollutions/image-not-available.png";
// import ImgGraffitti from "../assets/images/pollutions/graffitti.png";
// import ImgFadedSignage from "../assets/images/pollutions/graffitti.png";
// // ------------------------------------------------------------------------------

export default function Dashboard() {
  const [pollutions, setPollutions] = useState([]);

  const [isLoading, setLoading] = useState(true);

  const [markers, setMarkers] = useState([]);

  const [showMapLoading, setMapLoading] = useState(false);

  const getPollutions = async () => {
    await Api.get("/admin/pollutions").then((res) => {
      setPollutions(res.data.data);
      setLoading(false);
    });
  };

  const createPollutionCard = (pollutions) => {
    if (!pollutions.length) {
      return <div>Nothing</div>;
    }

    let p = pollutions.map((pollution) => {
      return (
        <div className="col-12 col-sm-6 col-md-3 my-2" key={pollution.id}>
          <Link
            to={`/pollutions/` + pollution.id}
            className="card card-blue-select p-2"
          >
            <img
              className="img-fluid"
              src={`images/pollutions/${pollution.image_name}`}
            />
            <div className="card-body">
              <h6 className="card-title">{pollution.type}</h6>
              <p className="text-muted mb-0">{pollution.kind}</p>
            </div>
          </Link>
        </div>
      );
    });

    return <div className="row my-2 animated fadeInDown">{p}</div>;
  };

  const locationMarkers = async () => {
    await Api.get("/admin/image").then((res) => {
      let imageCoordsData = res.data.data;

      let locationMarkersCollection = [];

      imageCoordsData.map((imageCoordsLocation) => {
        locationMarkersCollection.push({
          latitude: imageCoordsLocation.latitude,
          longitude: imageCoordsLocation.longitude,
        });
      });

      setMarkers(locationMarkersCollection);

      console.log(locationMarkersCollection.length);

      console.log(locationMarkersCollection);
    });
  };

  useEffect(() => {
    getPollutions();
    locationMarkers();
  }, []);

  return (
    <Fragment>
      <div className="container my-4">
        <SkeletonTheme
          baseColor="lightgray"
          highlightColor="rgba(255, 255, 255, 0.5)"
        >
          <h1 className="w-25">
            {isLoading ? <Skeleton count={1} /> : "Dashboard"}
          </h1>
        </SkeletonTheme>
        {showMapLoading ? (
          <HalfMalf
            text={"Loading Map"}
            bgColor={"transparent"}
            center={true}
            width={"150px"}
            height={"150px"}
          />
        ) : (
          <div className="row animated fadeInDown">
            <div className="col-md-12">
              <Gmap
                markers={markers}
                showMarkers={1}
              />
            </div>
          </div>
        )}

        <SkeletonTheme
          baseColor="lightgray"
          highlightColor="rgba(255, 255, 255, 0.5)"
        >
          <h1 className="w-25 mt-5">
            {isLoading ? <Skeleton count={1} /> : "Pollution Types"}
          </h1>
        </SkeletonTheme>
        {!isLoading ? (
          createPollutionCard(pollutions)
        ) : (
          <HalfMalf
            text={""}
            bgColor={"transparent"}
            center={true}
            width={"150px"}
            height={"150px"}
          />
        )}
      </div>
    </Fragment>
  );
}
