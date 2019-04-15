export default class Utils {
  static validateEmail(email) {
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (email.length <= 0) {
      return {
        valid: false,
        message: "Please enter an email address."
      };
    }
    if (!regex.test(email)) {
      return {
        valid: false,
        message: "Please enter a valid email address."
      };
    }

    return { valid: true, message: "Nice job, champ!" };
  }

  static validatePassword(password) {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long."
      };
    }

    return { valid: true, message: "Nice job, champ!" };
  }

  static validateUsername(username) {
    const regex = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/;

    if (username.length <= 0) {
      return {
        valid: false,
        message: "Please enter a username. "
      };
    }
    if (username.length > 20) {
      return {
        valid: false,
        message: "Usernames cannot be more than 20 characters long."
      };
    }
    if (!regex.test(username)) {
      return {
        valid: false,
        message:
          "Usernames can only contain alphanumeric characters or" +
          " non-adjacent hyphens, and cannot begin with a hyphen."
      };
    }

    return { valid: true, message: "Nice job, champ!" };
  }

  /**
   * Functions getDistanceFromLatLonInM and getBearingsFromLatLonInDegrees referenced from:
   * http://www.movable-type.co.uk/scripts/latlong.html
   */

  // location1 and location2 represent the user's own location
  // and the target user's location respectively
  static getDistanceFromLatLonInM(location1, location2) {
    if (
      location1.latitude != null &&
      location1.longitude != null &&
      location2.latitude != null &&
      location2.longitude != null
    ) {
      var lat1 = location1.latitude;
      var lat2 = location2.latitude;
      var lon1 = location1.longitude;
      var lon2 = location2.longitude;
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2 - lat1);
      var dLon = this.deg2rad(lon2 - lon1);
      var lat1Rad = this.deg2rad(lat1);
      var lat2Rad = this.deg2rad(lat2);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) *
          Math.cos(lat2Rad) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c * 1000; // Distance in m
      return d;
    } else {
      return;
    }
  }
  // location1 and location2 represent the user's own location
  // and the target locationrespectively
  static getBearingsFromLatLonInDegrees(location1, location2) {
    if (
      location1.latitude != null &&
      location1.longitude != null &&
      location2.latitude != null &&
      location2.longitude != null
    ) {
      var lat1 = location1.latitude;
      var lat2 = location2.latitude;
      var lon1 = location1.longitude;
      var lon2 = location2.longitude;
      var lat1Rad = this.deg2rad(lat1);
      var lat2Rad = this.deg2rad(lat2);
      var lon1Rad = this.deg2rad(lon1);
      var lon2Rad = this.deg2rad(lon2);
      var y = Math.sin(lon2Rad - lon1Rad) * Math.cos(lat2Rad);
      var x =
        Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);
      var bearing = this.rad2deg(Math.atan2(y, x));
      return bearing;
    } else {
      return;
    }
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  static rad2deg(rad) {
    return rad / (Math.PI / 180);
  }
}
