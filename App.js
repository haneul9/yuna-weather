import React from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import Loading from "./Loading";
import Weather from "./Weather";
import axios from "axios";

const API_KEY = "1e3d3212501c1931ee6a2f5a1fec8a2b";

export default class extends React.Component {
  state = {
    isLoading: true,
  };

  getWeather = async (latitude, longitude) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const {
      data: {
        main: { temp },
        weather,
      },
    } = await axios.get(url);

    this.setState({ isLoading: false, temp, condition: weather[0].main });
  };

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}
