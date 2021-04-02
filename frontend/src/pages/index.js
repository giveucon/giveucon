import { useEffect } from "react";
import Router from 'next/router'


export default function Index() {

  useEffect(() => {
    Router.push('/home')
  });

  return null;
}
