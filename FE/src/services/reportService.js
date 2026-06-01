import api from "./api";


export const getReports = async () => {

  try {

    const res =
      await api.get("/plc-logs");

    return res.data;

  } catch (error) {

    console.log(error);

    return [];

  }

};
