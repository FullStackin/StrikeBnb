import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import { getReviewsThunk, updateReviewThunk } from "../../store/reviews";
import Reviews from "../Reviews";
import ReviewForm from "../ReviewForm";
import BookingIndex from "../Bookings/BookingIndex";
import OpenModalButton from "../OpenModalButton";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons"; // Import FontAwesome icons
import "./Spots.css";

function SingleSpot() {
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    dispatch(getSpotThunk(spotId));
    dispatch(getReviewsThunk(spotId));
  }, [dispatch, spotId]);

  let spotImageUrls = [];
  if (spot && spot.SpotImages) {
    spot.SpotImages.forEach((image) => {
      spotImageUrls.push(image.url);
    });
  }

  let reviewList = Object.values(reviews);
  let ratingDisplay = spot.avgStarRating
    ? spot.avgStarRating.toFixed(1)
    : " New";

  if (Object.keys(spot).length === 0) {
    return <h1>Loading...</h1>;
  }

  const mainImg = spotImageUrls && spotImageUrls[0];
  const galleryImages = spotImageUrls.slice(1);

  return (
    <div className="single-spot-wrapper">
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <p className="location">
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </div>
      <div className="spot-details">
        <div className="gallery">
          <img
            src={mainImg}
            className="main-img"
            alt="Main"
            style={{ borderRadius: "20px", margin: "10px" }}
          />

          <div className="gallery-image-wrapper">
            <Carousel
              showThumbs={false}
              showStatus={false}
              className="custom-carousel"
              showArrows={true}
            >
              {galleryImages.map((image, i) =>
                image ? (
                  <div key={i} className="carousel-slide">
                    <img
                      className="gallery-image"
                      alt={spot.name}
                      src={image}
                    />
                  </div>
                ) : (
                  <div className="empty-gallery-slot" key={i}></div>
                )
              )}
            </Carousel>
          </div>
        </div>
        <div className="single-spot-info-box">
          <div className="name-desc-box">
            <h2>
              Hosted by {spot.Owner ? spot.Owner.firstName : "Unknown"}{" "}
              {spot.Owner ? spot.Owner.lastName : "Host"}
            </h2>
            <p className="desc">{spot.description}</p>
          </div>
          <div className="callout-wrapper">
            <div className="callout-row1">
              <h2 className="price">${spot.price} per night</h2>
              <div className="rating-review">
                <h3>
                  <FontAwesomeIcon icon={solidStar} /> {ratingDisplay}
                </h3>
                <h3>{reviewList.length > 0 && " · "}</h3>
                <h3>
                  {reviewList.length > 0 &&
                    reviewList.length +
                      " review" +
                      (reviewList.length > 1 ? "s" : "")}
                </h3>
              </div>
            </div>

            <button
              id="reserve-button"
              onClick={() => {
                history.push(`/spots/${spot.id}/bookings`);
              }}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>

      <hr />

      <div className="review-section">
        <div>
          <div className="review-summary">
            <h3>
              <i className="fa-solid fa-star"></i> {ratingDisplay}
            </h3>
            <h3>{reviewList.length > 0 && " · "}</h3>
            <h3>
              {reviewList.length > 0 &&
                reviewList.length +
                  " review" +
                  (reviewList.length > 1 ? "s" : "")}
            </h3>
          </div>
          {sessionUser &&
            spot.Owner &&
            sessionUser.id !== spot.Owner.id &&
            !reviewList.find((review) => review.userId === sessionUser.id) && (
              <OpenModalButton
                buttonText="Post Your Review"
                modalComponent={<ReviewForm spotId={spot.id}></ReviewForm>}
                buttonClassName="open-modal-button"
              />
            )}
          <Reviews reviews={reviewList} spot={spot} sessionUser={sessionUser} />
        </div>
      </div>
    </div>
  );
}

export default SingleSpot;