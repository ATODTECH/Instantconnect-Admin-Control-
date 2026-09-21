"use server"
import z from "zod"
import { FormState, LoginFormSchema } from "../validate-ic/formvalidator"

// POST
export const ValidateLogin = async (state: FormState, formData: FormData) => {
  const validatedFields = LoginFormSchema.safeParse({
    role: formData.get('role'),
    username: formData.get('username'),
    password: formData.get('password'),
  })
    
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    }
  }
  
  // Call the provider or db to create a admin...
  try {
    const mainData = JSON.stringify(validatedFields.data);

    // const res = await fetch(`${process.env.API_URL}/admin/login/api/`, {
    //   method: "POST",
    //   mode: "cors",
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'API-Key': process.env.API_SECRET_KEY!,
    //     'Origin': process.env.BASE_URL!,
    //     'Access-Control-Request-Headers': 'X-PINGOTHER, Content-Type',
    //     'Access-Control-Request-Method': 'POST',
    //   },
    //   body: mainData,
    // });

    // const data: res = await res.json();
    // if (data.status!=200) {
    //   throw data.data;
    // }
    
    return {
      message: 'success'
    }    
      
  } catch (error: any) {
    const err: string = error;
    return {
      message: err,
    }
  }
}