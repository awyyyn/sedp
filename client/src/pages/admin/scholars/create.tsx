import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Form, Formik } from "formik";
import { Suspense, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { RadioGroup, Radio } from "@heroui/radio";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/autocomplete";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import { Button } from "@heroui/button";
import { DatePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "sonner";

import places from "../../../../places.json";
import degrees from "../../../../degrees.json";

import { addScholarSchema } from "@/definitions";
import { CREATE_STUDENT_MUTATION, READ_STUDENTS_QUERY } from "@/queries";
import { AddScholarSchemaData } from "@/types";
import { years } from "@/constants";
import { generatePassword } from "@/lib/utils";
import {
  headingClasses,
  officesOptions,
  schoolOptions,
  semester,
} from "@/lib/constant";
import { useAuth } from "@/contexts";

export default function AddScholar() {
  const [streets, setStreet] = useState<string[]>([]);
  const [createStudent] = useMutation(CREATE_STUDENT_MUTATION);
  const { role, office } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const citiesMunicipalities = useMemo(
    () => places.map((place) => place.name),
    [],
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Create Scholar | Admin</title>
        <meta
          name="description"
          content="Create a new scholar account with secure credentials and send them via email."
        />
      </Helmet>
      <Card className="rounded-md shadow-md mb-10  z-[10]">
        <CardHeader className="flex rounded-none bg-[#A6F3B2] flex-col items-start">
          <h1 className="text-2xl">Create new Scholar </h1>
          <p>
            Generate secure credentials for a new scholar and send them via
            email.
          </p>
        </CardHeader>
        <CardBody className="bg-[#A6F3B235]">
          <div className="lg:max-w-[80%] w-full mx-auto my-5">
            <Formik
              validationSchema={addScholarSchema}
              enableReinitialize
              initialValues={{ office } as AddScholarSchemaData}
              onSubmit={async (values: AddScholarSchemaData, helpers) => {
                if (role === "SUPER_ADMIN" && !values.office) {
                  helpers.setFieldError("office", "Office is required");

                  return;
                }

                try {
                  const { street, city, ...data } = values;

                  await createStudent({
                    variables: {
                      ...data,
                      yearLevel: Number(data.yearLevel),
                      address: {
                        city,
                        street,
                      },
                      semester: Number(data.semester),
                    },
                    refetchQueries: [READ_STUDENTS_QUERY],
                  });

                  helpers.resetForm();

                  navigate("/admin/scholars");

                  toast.success("Scholar account created successfully", {
                    description:
                      "The new admin account has been created and the registration link has been sent to the provided email address.",
                    richColors: true,
                    position: "top-center",
                  });
                } catch (err) {
                  toast.error("Failed to create scholar account", {
                    description:
                      (err as Error).message ||
                      "There was an error creating the scholar account. Please try again.",
                    richColors: true,
                    position: "top-center",
                  });
                }
              }}
            >
              {({
                handleSubmit,
                handleBlur,
                handleChange,
                setFieldValue,
                values,
                touched,
                errors,
                isSubmitting,
              }) => {
                console.log(errors, "qqq errors");

                return (
                  <Form
                    className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="lg:col-span-6">Personal Information</div>
                    <Input
                      isReadOnly={isSubmitting}
                      isInvalid={touched.firstName && !!errors.firstName}
                      errorMessage={errors.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="lg:col-span-2"
                      name="firstName"
                      label="First Name"
                    />
                    <Input
                      isReadOnly={isSubmitting}
                      isInvalid={touched.middleName && !!errors.middleName}
                      errorMessage={errors.middleName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="middleName"
                      className="lg:col-span-2"
                      label="Middle Name"
                    />
                    <Input
                      isReadOnly={isSubmitting}
                      isInvalid={touched.lastName && !!errors.lastName}
                      errorMessage={errors.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="lg:col-span-2"
                      name="lastName"
                      label="Last Name"
                    />
                    <Input
                      isReadOnly={isSubmitting}
                      isInvalid={touched.email && !!errors.email}
                      errorMessage={errors.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="lg:col-span-3"
                      label="Email Address"
                      name="email"
                    />
                    <Input
                      isReadOnly={isSubmitting}
                      isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                      errorMessage={errors.phoneNumber}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="phoneNumber"
                      className="lg:col-span-3"
                      label="Phone Number"
                      maxLength={10}
                      startContent={<p className="text-sm">+63</p>}
                    />
                    <RadioGroup
                      label="Gender"
                      className="lg:col-span-3 "
                      name="gender"
                      isReadOnly={isSubmitting}
                      isInvalid={touched.gender && !!errors.gender}
                      errorMessage={String(errors.gender) || "asd"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      orientation="horizontal"
                    >
                      <Radio value="MALE">Male</Radio>
                      <Radio value="FEMALE">Female</Radio>
                    </RadioGroup>
                    <DatePicker
                      showMonthAndYearPickers
                      isReadOnly={isSubmitting}
                      isInvalid={touched.birthDate && !!errors.birthDate}
                      errorMessage={String(errors.birthDate)}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        if (e === null) return;
                        const dateValue: {
                          year: number;
                          month: number;
                          day: number;
                        } = e;

                        const jsDate = dateValue
                          ? new Date(
                              dateValue.year,
                              dateValue.month - 1,
                              dateValue.day,
                            )
                          : null;

                        setFieldValue("birthDate", jsDate);
                      }}
                      className="lg:col-span-3"
                      label="Birth Date"
                      maxValue={today(getLocalTimeZone()).subtract({
                        years: 18,
                      })}
                    />

                    <div className="lg:col-span-6 mt-4">
                      Address Information
                    </div>

                    <div className="lg:col-span-3">
                      <Suspense
                        fallback={
                          <Input
                            fullWidth
                            readOnly
                            label="Select City / Municipality"
                          />
                        }
                      >
                        <Autocomplete
                          as="ul"
                          isReadOnly={isSubmitting}
                          name="city"
                          label="Select City / Municipality"
                          isInvalid={!!touched.city && !!errors.city}
                          onSelectionChange={(value) => {
                            setFieldValue("city", value);
                            const streets =
                              places
                                .find((place) => place.name === value)
                                ?.barangays.flat() ?? [];

                            setFieldValue("street", "");
                            setStreet(streets);
                          }}
                          size="md"
                          onBlur={handleBlur}
                          errorMessage={touched.city && errors.city}
                          fullWidth
                        >
                          {citiesMunicipalities.map((ci) => (
                            <AutocompleteItem
                              as="li"
                              key={ci}
                              value={ci}
                              className="capitalize"
                            >
                              {ci}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </Suspense>
                    </div>
                    <div className="lg:col-span-3   ">
                      <Suspense
                        fallback={
                          <Input
                            fullWidth
                            readOnly
                            label="Select City / Municipality"
                          />
                        }
                      >
                        <Autocomplete
                          isReadOnly={isSubmitting}
                          name="street"
                          label="Select Barangay"
                          errorMessage={touched.street && errors.street}
                          onBlur={handleBlur}
                          onSelectionChange={(value) => {
                            setFieldValue("street", value);
                          }}
                          isDisabled={!values.city}
                          fullWidth
                          isInvalid={
                            (touched.street && !values.city) ||
                            (!!touched.street && !!errors.street)
                          }
                          value={values.street}
                        >
                          {streets.map((brgy) => (
                            <AutocompleteItem
                              key={brgy}
                              value={brgy}
                              className="capitalize"
                            >
                              {brgy}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </Suspense>
                    </div>

                    <div className="lg:col-span-6  mt-4">
                      School Information
                    </div>

                    <Autocomplete
                      label="School Name"
                      defaultItems={schoolOptions}
                      isInvalid={touched.schoolName && !!errors.schoolName}
                      errorMessage={errors.schoolName}
                      name="schoolName"
                      selectedKey={values.schoolName}
                      onBlur={handleBlur}
                      onSelectionChange={(v) => {
                        setFieldValue("schoolName", v);
                        // setFieldError("schoolName", undefined);
                      }}
                      allowsEmptyCollection={false}
                      className="lg:col-span-6"
                    >
                      {(item) => (
                        <AutocompleteItem key={item.key}>
                          {item.label}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>

                    <Select
                      className="lg:col-span-3"
                      label="Year Level"
                      name="yearLevel"
                      isInvalid={touched.yearLevel && !!errors.yearLevel}
                      errorMessage={errors.yearLevel}
                      disallowEmptySelection
                      selectionMode="single"
                      value={values.yearLevel}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {years.map((year) => (
                        <SelectItem
                          className="w-full"
                          value={year.value.toString()}
                          key={year.value.toString()}
                          textValue={year.label}
                        >
                          {year.label}{" "}
                          {year.optional && "(If Applicable to your program)"}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      className="lg:col-span-3"
                      label="Semester"
                      name="semester"
                      isInvalid={touched.semester && !!errors.semester}
                      errorMessage={errors.semester}
                      disallowEmptySelection
                      selectionMode="single"
                      value={values.semester}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {[1, 2, 3].map((value) => (
                        <SelectItem
                          className="w-full"
                          value={value.toString()}
                          key={value.toString()}
                          textValue={semester[value - 1]}
                        >
                          {semester[value - 1]}
                        </SelectItem>
                      ))}
                    </Select>
                    <Suspense
                      fallback={<Input fullWidth readOnly label="Course" />}
                    >
                      <Autocomplete
                        name="course"
                        className="lg:col-span-6"
                        label="Course"
                        onSelectionChange={(value) => {
                          setFieldValue("course", value?.toString());
                        }}
                        onBlur={handleBlur}
                        errorMessage={errors.course}
                        fullWidth
                        isInvalid={touched.course && !!errors.course}
                        value={values.course}
                      >
                        {degrees.map((degree, indx) => (
                          <AutocompleteSection
                            showDivider
                            title={degree.category}
                            key={indx}
                          >
                            {degree.programs.map((program) => (
                              <AutocompleteItem
                                key={program}
                                value={program}
                                className="capitalize"
                              >
                                {program}
                              </AutocompleteItem>
                            ))}
                          </AutocompleteSection>
                        ))}
                      </Autocomplete>
                    </Suspense>

                    <div className="lg:col-span-6 mt-4">
                      <div className="flex justify-between py-0.5">
                        <p>Security</p>
                        <Button
                          type="button"
                          className=""
                          variant="light"
                          size="sm"
                          onPress={() => {
                            setFieldValue("password", generatePassword());
                          }}
                        >
                          Generate password
                        </Button>
                      </div>
                      <Input
                        type={showPass ? "text" : "password"}
                        isReadOnly={isSubmitting}
                        readOnly={isSubmitting}
                        value={values.password}
                        isInvalid={touched.password && !!errors.password}
                        errorMessage={errors.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="password"
                        label="Password"
                        endContent={
                          <Button
                            size="sm"
                            isIconOnly
                            variant="ghost"
                            onPress={() => setShowPass((show) => !show)}
                            className="border-none p-0.5 hover:bg-transparent"
                          >
                            <Icon
                              icon={
                                showPass
                                  ? "fluent:eye-48-regular"
                                  : "fluent:eye-off-16-filled"
                              }
                              width="96"
                              height="96"
                              style={{ color: "#888" }}
                            />
                          </Button>
                        }
                      />
                    </div>

                    <div className="lg:col-span-6 mt-4">
                      <div className="flex justify-between py-0.5">
                        <p>Office</p>
                      </div>

                      {role === "SUPER_ADMIN" ? (
                        <Select
                          isDisabled={role !== "SUPER_ADMIN"}
                          className="lg:col-span-3"
                          label={`Office ${office}`}
                          name="office"
                          isRequired={!!errors.office}
                          isInvalid={touched.office && !!errors.office}
                          errorMessage={errors.office}
                          disallowEmptySelection
                          selectionMode="single"
                          value={values.office}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          scrollShadowProps={{
                            isEnabled: false,
                          }}
                        >
                          {officesOptions.map((option) => {
                            const offices = option.offices;

                            return (
                              <SelectSection
                                title={option.province}
                                key={option.province}
                                classNames={{
                                  heading: headingClasses,
                                }}
                              >
                                {offices.map((office) => (
                                  <SelectItem
                                    className="w-full"
                                    value={office}
                                    key={office}
                                    textValue={office}
                                  >
                                    {office}
                                  </SelectItem>
                                ))}
                              </SelectSection>
                            );
                          })}
                        </Select>
                      ) : (
                        <Input
                          isReadOnly={true}
                          name="office"
                          label="Office"
                          value={values.office}
                        />
                      )}
                    </div>

                    <div className="lg:col-span-6 flex justify-center mt-5">
                      <Button
                        type="submit"
                        // isDisabled={!isValid || isSubmitting}
                        isLoading={isSubmitting}
                        className="min-w-full md:min-w-[60%] bg-[#A6F3B2]"
                      >
                        Register Scholar
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

// "note": "This list is not exhaustive. Philippine universities and colleges regularly update their program offerings based on industry demands and educational trends."
