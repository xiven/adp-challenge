const axios = require('axios');
require('dotenv').config();

const businessReview = async id => {
  try {
    let reviewResults = await axios.get(
      `https://api.yelp.com/v3/businesses/${id}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`
        },
        params: {
          limit: 1
        }
      }
    );
    let resultObj = {};
    reviewResults.data.reviews.map(review => {
      resultObj = {
        name: review.user.name,
        text: review.text,
        url: review.url
      };
    });
    return resultObj;
  } catch (error) {
    console.error(error);
  }
};

const businessSearch = async (searchQuery, location) => {
  try {
    let searchResults = await axios.get(
      'https://api.yelp.com/v3/businesses/search',
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`
        },
        params: {
          term: searchQuery,
          limit: 5,
          location,
          radius: 3218
        }
      }
    );
    let businesses = [];
    for (const business of searchResults.data.businesses) {
      let businessObj = {
        id: business.id,
        name: business.name,
        address: business.location.display_address
      };
      const review = await businessReview(business.id);
      businessObj.review = review;
      businesses.push(businessObj);
    }

    printResults(businesses);
  } catch (error) {
    console.error(error);
  }
};

const printResults = businesses => {
  //print out results
  businesses.map(b => {
    console.log(b.name);
    b.address.map(a => {
      console.log(a);
    });
    console.log(`Review: ${b.review.text}`);
    console.log(`Posted By: ${b.review.name}`);
    console.log('\n');
  });
};

businessSearch('ice cream', 'Alpharetta, GA');
