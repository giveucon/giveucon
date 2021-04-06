import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { getSession, useSession } from "next-auth/client";
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Layout from '../../components/Layout'
import Section from '../../components/Section'

function Create(props) {
  const router = useRouter();
  const [session, loading] = useSession();
  const [selfUser, setSelfUser] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    dark_mode: false
  });
  const handleTextFieldChange = (event) => {
    setSelfUser({ ...selfUser, [event.target.name]: event.target.value });
  };
  const handleCheckBoxChange = (event) => {
    setSelfUser({ ...selfUser, [event.target.name]: event.target.checked });
  };

  const getSelfUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/accounts/self`, {
          headers: {
            'Authorization': "Bearer " + session?.accessToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
      setSelfUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postSelfUser = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/`, {
          email: selfUser.email,
          user_name: selfUser.username,
          first_name: selfUser.first_name,
          last_name: selfUser.last_name,
          dark_mode: selfUser.dark_mode,
        }, {
          headers: {
            'Authorization': "Bearer " + session?.accessToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSelfUser()
  },[])

  return (
    <Layout title="사용자 생성 - Give-U-Con">
      <Section
        backButton
        title="사용자 생성"
      >
      </Section>
      <Section
        title="로그인 정보"
        titlePrefix={<IconButton><AccountCircleIcon /></IconButton>}
      >
        {selfUser && (
          <>
            <Box>
              <TextField
                name="username"
                value={selfUser.username}
                fullWidth
                label="사용자 이름"
                onChange={handleTextFieldChange}
                required
              />
            </Box>
            <Box>
              <TextField
                name="email"
                value={selfUser.email}
                fullWidth
                label="이메일"
                onChange={handleTextFieldChange}
                required
              />
            </Box>
            <Box>
              <TextField
                name="last_name"
                value={selfUser.last_name}
                fullWidth
                label="성"
                onChange={handleTextFieldChange}
                required
              />
            </Box>
            <Box>
              <TextField
                name="first_name"
                value={selfUser.first_name}
                fullWidth
                label="이름"
                onChange={handleTextFieldChange}
                required
              />
            </Box>
            <Box>
              <FormGroup row>
                <FormControlLabel
                control={
                  <Checkbox
                    name="dark_mode"
                    color="primary"
                    checked={selfUser.dark_mode}
                    onChange={handleCheckBoxChange}
                  />
                }
                label="Dark Mode"
                />
              </FormGroup>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button
                color="primary"
                variant="contained"
                onClick={ () => {
                    postSelfUser();
                    router.push('/myaccount');
                  }
                }
              >
                제출
              </Button>
            </Box>
          </>
        )}
      </Section>
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}

export default Create;
