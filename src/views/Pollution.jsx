import { Fragment, useEffect, useState } from "react";
import Api from "../lib/Api/Api";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useParams } from "react-router-dom";

import Gmap from "../components/Gmap";

import ImageLabelBox from "../components/ImageLabelBox";

export default function Pollution() {
  let { pollution_id } = useParams();

  const [isLoading, showLoading] = useState(true);
  const [pollution, setPollution] = useState();
  const [pollutionList, setPollutionList] = useState({});

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [showMap, toggleMapVisibility] = useState(false);

  const [selectedImageCoordsId, selectImageCoordsId] = useState(null);

  const [imageCoordsData, setImageCoordsData] = useState({});

  const [fixedImage, setFixedImageToUpload] = useState(null);

  const [locationMarker, setLocationMarkers] = useState([]);

  const getPollution = async () => {
    await Api.get(`/admin/pollutions/${pollution_id}`).then((res) => {
      setPollution(res.data.data);
      getPollutionList();
    });
  };

  const getPollutionList = async () => {
    await Api.post(`/admin/image_coords`, { pollution_id }).then((res) => {
      setPollutionList(res.data.data);
      showLoading(false);
    });
  };

  const createPollutionListCard = (pollutionList) => {
    if (!pollutionList.length) {
      return <div>No Data Submitted</div>;
    }

    let image_coords = pollutionList.map((pollution) => {
      return (
        <div className={`card mb-4`} key={pollution.id}>
          <div className="card-body">
            <p className="text-muted mb-0">Submitted by</p>
            <h4>{pollution.user_name}</h4>
            <a
              href="#"
              className="text-success"
              onClick={() => setMapLocation(pollution.latitude, pollution.longitude)}
            >
              <i className="fa-solid fa-location-dot me-2"></i>
              {pollution.latitude}, {pollution.longitude}{" "}
            </a>
            <div className="d-flex gap-2 mt-4">
              {pollution.is_fixed ? (
                <button
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={() => markThisAsUnfixed(pollution.id)}
                >
                  <i className="fa-solid fa-arrow-rotate-left fa-fw"></i> Mark
                  Unfixed
                </button>
              ) : (
                <button
                  className="btn btn-success btn-sm"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#markFixedModal"
                  onClick={() => getSelectedPollutionData(pollution.id)}
                >
                  <i className="fa-solid fa-circle-check fa-fw"></i> Mark Fixed
                </button>
              )}
              <button
                className="btn btn-light btn-sm"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#viewDetailsModal"
                onClick={() => getSelectedPollutionData(pollution.id)}
              >
                <i className="fa-solid fa-circle-info fa-fw"></i> View Details
              </button>
            </div>
          </div>
        </div>
      );
    });

    return <div className="animated fadeInDown">{image_coords}</div>;
  };

  const setMapLocation = (lat, long) => {
    toggleMapVisibility(false);

    setLatitude(lat);
    setLongitude(long);

    toggleMapVisibility(true);
  };

  useEffect(() => {
    getPollution();
  }, []);

  const getSelectedPollutionData = async (selectedImageId) => {
    selectImageCoordsId(selectedImageId);

    await Api.get(`/admin/image_coords/${selectedImageId}`).then((res) =>
      setImageCoordsData(res.data.data)
    );

    return;
  };

  const handleImageInput = (e) => {
    setFixedImageToUpload(e.target.files[0]);
  };

  const markThisAsFixed = async () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    let formData = new FormData();
    formData.append("image", fixedImage);
    formData.append("image_id", selectedImageCoordsId);

    await Api.post("/admin/image", formData, config)
      .then((res) => {
        setFixedImageToUpload(null);
        getPollution();
      })
      .catch((err) => console.log(err));

    return;
  };

  const markThisAsUnfixed = async (selectedId) => {
    await Api.get(`/admin/image_coords/${selectedId}/unfix`).then((res) => {
      getPollution();
    });
    return;
  };

  return (
    <Fragment>
      <div
        className="modal fade"
        id="viewDetailsModal"
        tabIndex="-1"
        aria-labelledby="viewDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="viewDetailsModalLabel">
                View Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-7">
                  <p className="text-muted mb-0">Submitted by</p>
                  <h3>{imageCoordsData.user_name}</h3>

                  <p className="mt-4 mb-0">
                    Latitude:{" "}
                    <span className="text-muted">
                      {imageCoordsData.latitude}
                    </span>
                  </p>
                  <p className="mb-0">
                    Longitude:{" "}
                    <span className="text-muted">
                      {imageCoordsData.longitude}
                    </span>
                  </p>
                  <p className="mb-0">
                    Status:{" "}
                    {imageCoordsData.is_fixed ? (
                      <span className="text-success">Fixed</span>
                    ) : (
                      <span className="text-danger">Not fixed</span>
                    )}
                  </p>
                </div>
                <div className="col-md-5">
                  <p>
                    <strong>Reported image:</strong>
                  </p>
                  {imageCoordsData.unfixed_image ? (
                    <img
                      className="img-fluid"
                      alt="reported image"
                      src={
                        process.env.REACT_APP_STORAGE_URL +
                        "/" +
                        imageCoordsData.unfixed_image
                      }
                    ></img>
                  ) : (
                    ""
                  )}

                  {imageCoordsData.is_fixed ? (
                    <Fragment>
                      <p className="mt-5">
                        <strong>Fixed Image:</strong>
                      </p>
                      {/* <img
                        className="img-fluid"
                        alt="Fixed Image"
                        src={
                          process.env.REACT_APP_STORAGE_URL +
                          "/" +
                          imageCoordsData.fixed_image
                        }
                      ></img> */}
                      <ImageLabelBox
                        image_file={
                          process.env.REACT_APP_STORAGE_URL +
                          "/" +
                          imageCoordsData.unfixed_image
                        }
                        w={imageCoordsData.w}
                        x={imageCoordsData.x}
                        y={imageCoordsData.y}
                        z={imageCoordsData.z}
                      />
                    </Fragment>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
              >
                <i className="fa-solid fa-thumbs-up"></i> Okay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="markFixedModal"
        tabIndex="-1"
        aria-labelledby="markFixedModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="markFixedModalLabel">
                Mark as fixed
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-7">
                  <p className="text-muted mb-0">Submitted by</p>
                  <h3>{imageCoordsData.user_name}</h3>

                  <p className="mt-4 mb-0">
                    Latitude:{" "}
                    <span className="text-muted">
                      {imageCoordsData.latitude}
                    </span>
                  </p>
                  <p className="mb-0">
                    Longitude:{" "}
                    <span className="text-muted">
                      {imageCoordsData.longitude}
                    </span>
                  </p>
                  <p className="mb-0">
                    Status: <span className="text-danger">Not fixed</span>
                  </p>
                </div>
                <div className="col-md-5">
                  <p>
                    <strong>Reported image:</strong>
                  </p>
                  {imageCoordsData.unfixed_image ? (
                    <img
                      className="img-fluid"
                      alt="reported image"
                      src={
                        process.env.REACT_APP_STORAGE_URL +
                        "/" +
                        imageCoordsData.unfixed_image
                      }
                    ></img>
                  ) : (
                    ""
                  )}

                  <p className="mt-5">
                    <strong>Upload fixed image:</strong>
                  </p>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleImageInput(e)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={markThisAsFixed}
              >
                <i className="fa-solid fa-circle-check fa-fw"></i> Mark this as
                fixed
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4">
        <SkeletonTheme
          baseColor="lightgray"
          highlightColor="rgba(255, 255, 255, 0.5)"
        >
          <p className="w-75 w-sm-25 text-muted mb-1">
            {isLoading ? <Skeleton count={1} /> : "Pollution"}
          </p>
          <h1 className="w-75 w-sm-50">
            {isLoading ? <Skeleton count={1} /> : pollution.type}
          </h1>
        </SkeletonTheme>
        <div className="row mt-4">
          <div className="col-md-5">
            {!isLoading ? (
              createPollutionListCard(pollutionList)
            ) : (
              <SkeletonTheme
                baseColor="lightgray"
                highlightColor="rgba(255, 255, 255, 0.5)"
              >
                <p>
                  <Skeleton count={5} />
                </p>
              </SkeletonTheme>
            )}
          </div>
          <div className="col-md-7">
            {showMap ? (
              <Gmap lat={latitude} long={longitude} />
            ) : (
              <div className="text-center my-5">
                <h1 className="text-center">
                  <i className="fa-solid fa-location-arrow"></i>
                </h1>
                <h4>Show in Map</h4>
                <p className="text-muted">
                  Click <strong>Show Map</strong> to show the location in Map.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
