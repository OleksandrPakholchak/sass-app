import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Flex } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Box,
  Text,
  Checkbox,
  Select,
  Stack,
} from "@chakra-ui/react";
import { connect, useDispatch } from "react-redux";
import { getParsedUsersFromFiles } from "../redux/actions/dataActions";
import { useToast } from "@chakra-ui/react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { useFormik } from "formik";
import { CampaignSchema } from "../validationSchemas/CampaignSchema";
import { createCampaign } from "../redux/actions/campaignActions";

const Campaigns = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [campaignCheckedUsers, setCampaignCheckedUsers] = useState([]);

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [campaignStartDate, setCampaignStartDate] = useState();
  const [campaignEndDate, setCampaignEndDate] = useState();
  const [campaignType, setCampaignType] = useState("");
  const [whatsappChecked, setWhatsappChecked] = useState(true);
  const [emailChecked, setEmailChecked] = useState(false);
  const [voiceChecked, setVoiceChecked] = useState(true);
  const rowsPerPage = 5; // You can adjust this number as needed
  const numPages = Math.ceil(props.parsedUsersFromFiles?.length / rowsPerPage);

  const currentPageData = props.parsedUsersFromFiles?.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, numPages - 1));
  };

  const previousPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 0));
  };

  const [parsedUsersFromFiles, setParsedUsersFromFiles] = useState([]);
  useEffect(() => {
    dispatch(getParsedUsersFromFiles(props.user?._id));
  }, []);

  const formik = useFormik({
    initialValues: {
      author: "",
      users: [],
      campaignType: "",
      startDate: null,
      endDate: null,
    },
    onSubmit: (values) => {
      dispatch(
        createCampaign({
          author: props.user._id,
          userId: props.user._id,
          campaignType: {
            voice: campaignType === "voice",
            whatsapp: whatsappChecked,
            email: emailChecked,
          },
          startDate: values.startDate,
          endDate: values.endDate,
          users: values.users,
        })
      );
    },
    validationSchema: CampaignSchema,
  });

  useEffect(() => {
    if (props.isError) {
      toast({
        position: "top",
        title: "Failure",
        description: props.errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [props.parsedUsersFromFiles, props.isError, props.errorMessage]);

  const setUsersAndAuthor = async () => {
    await formik.setFieldValue("users", campaignCheckedUsers, true);
    formik.setFieldValue("author", props.user.name);
  };
  useEffect(() => {
    setUsersAndAuthor();
  }, [campaignCheckedUsers]);

  const toggleCampaignUser = async (user, isChecked) => {
    let newUserList = [];
    if (isChecked) {
      const userFound = campaignCheckedUsers?.find(
        (item) => item.phoneNumber === user.phoneNumber
      );

      if (!userFound) {
        await setCampaignCheckedUsers([...campaignCheckedUsers, user]);
      }
    } else {
      newUserList = campaignCheckedUsers.filter(
        (item) => item.phoneNumber !== user.phoneNumber
      );
      await setCampaignCheckedUsers(newUserList);
    }

    console.log(campaignCheckedUsers);
  };

  const handleDateSelect = (ranges) => {
    console.log(ranges);
    const newSelectionRange = {
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: "selection",
    };
    setSelectionRange(newSelectionRange);
    setCampaignStartDate(ranges.selection.startDate);
    setCampaignEndDate(ranges.selection.endDate);
    formik.setFieldValue("startDate", ranges.selection.startDate);
    formik.setFieldValue("endDate", ranges.selection.endDate);
  };

  const handleCampaignTypeChange = (e) => {
    setCampaignType(e.target.value);
    formik.setFieldValue("campaignType", e.target.value);
  };

  return (
    <div>
      <Navbar></Navbar>
      <div>
        <Flex
          flexDirection="column"
          width="100wh"
          height="100wh"
          backgroundColor="black"
          justifyContent="center"
          alignItems="center"
        >
          <form onSubmit={formik.handleSubmit}>
            <Select
              marginTop={10}
              marginbottom={10}
              width={"fit-content"}
              color={"yellow"}
              // placeholder="Select campaign type"
              // _placeholder={{ backgroundColor: "black", color: "yellow" }}
              bg="black"
              colorScheme={"yellow"}
              onChange={(e) => handleCampaignTypeChange(e)}
            >
              <option selected hidden disabled value="">
                Select campaign type
              </option>

              <option
                style={{ backgroundColor: "black", color: "yellow" }}
                color="black"
                value="voice"
              >
                voice
              </option>
              <option
                style={{ backgroundColor: "black", color: "yellow" }}
                color="black"
                value="text"
              >
                text
              </option>
            </Select>

            {campaignType === "text" ? (
              <Stack spacing={5} direction="row" marginTop={5}>
                <Checkbox
                  onChange={(e) => setWhatsappChecked(e.target.checked)}
                  value={whatsappChecked}
                  colorScheme="green"
                  defaultChecked
                >
                  <p style={{ color: "yellow" }}>Whatsapp</p>
                </Checkbox>
                <Checkbox
                  onChange={(e) => setEmailChecked(e.target.checked)}
                  value={emailChecked}
                  colorScheme="blue"
                >
                  <p style={{ color: "yellow" }}>Email</p>
                </Checkbox>
              </Stack>
            ) : (
              ""
            )}

            <div>
              {formik.errors.campaignType ? (
                <p style={{ color: "red" }}>{formik.errors.campaignType}</p>
              ) : null}
            </div>

            <h1
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "orange",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              Select Campaign Users
            </h1>

            <TableContainer>
              <Table variant="simple">
                <TableCaption color="orange"></TableCaption>
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th color={"gray"}>Name</Th>
                    <Th color={"gray"}>First Name</Th>
                    <Th color={"gray"} isNumeric>
                      Phone Number
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {currentPageData?.map((user, index) => (
                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) =>
                            toggleCampaignUser(
                              currentPageData[index],
                              e.target.checked
                            )
                          }
                          colorScheme="green"
                        ></Checkbox>
                      </Td>
                      <Td color={"yellow"}>{user.name}</Td>
                      <Td color={"yellow"}>{user.firstName}</Td>
                      <Td color={"yellow"} isNumeric>
                        {user.phoneNumber}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Td>
                    <Text color={"grey"}>Page: {currentPage + 1}</Text>
                    {/* <Text color={"grey"}>Total: {numPages}</Text> */}
                  </Td>
                  <Td></Td>
                  <Td></Td>
                  <Td>
                    <Text color={"grey"}>Total pages: {numPages}</Text>
                    {/* <Text color={"grey"}>Total: {numPages}</Text> */}
                  </Td>
                </Tfoot>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" mt="4">
              <Button
                borderRadius={0}
                mr={5}
                onClick={previousPage}
                disabled={currentPage === 0}
                colorScheme="yellow"
              >
                Previous
              </Button>
              <Button
                colorScheme="yellow"
                borderRadius={0}
                onClick={nextPage}
                disabled={currentPage >= numPages - 1}
              >
                Next
              </Button>
            </Box>

            <div>
              {formik.errors.users ? (
                <p style={{ color: "red" }}>{formik.errors.users}</p>
              ) : null}
            </div>

            <Flex justifyContent={"center"} flexDirection="column">
              <h1
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "orange",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                Please select date range for campaign(start date and end date)
              </h1>
              <DateRange
                ranges={[selectionRange]}
                onChange={handleDateSelect}
              />
              <div>
                {formik.errors.startDate ? (
                  <p style={{ color: "red" }}>{formik.errors.startDate}</p>
                ) : null}
              </div>

              <div>
                {formik.errors.endDate ? (
                  <p style={{ color: "red" }}>{formik.errors.endDate}</p>
                ) : null}
              </div>
            </Flex>
            <Flex marginTop={10} justifyContent={"center"}>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="yellow"
                width="30"
              >
                {/* {!loading && <Spinner mr={2} />} */}
                Create Campaign
              </Button>
            </Flex>
          </form>
        </Flex>
      </div>
      {/* Adaugă funcționalitatea pentru configurarea campaniilor aici */}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    parsedUsersFromFiles: state.data.parsedUsersFromFiles,
    isError: state.data.isError,
    errorMessage: state.data.errorMessage,
  };
}
export default connect(mapStateToProps)(Campaigns);
