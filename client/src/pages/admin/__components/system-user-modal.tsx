import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Icon } from "@iconify/react";

import {
  getSystemUserRoleColorMap,
  getSystemUserStatusColorMap,
} from "@/lib/constant";
import { SystemUser } from "@/types";
import { formatDate } from "date-fns";

interface SystemUserModalProps {
  user: SystemUser | null;
  handleClose: VoidFunction;
}

export function SystemUserModal({ user, handleClose }: SystemUserModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: !!user,
    onClose: handleClose,
  });

  return (
    user && (
      <>
        <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={`${user.firstName} ${user.lastName}`}
                      color="primary"
                      size="lg"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">
                        {user.firstName}{" "}
                        {user.middleName ? `${user.middleName} ` : ""}
                        {user.lastName}
                      </h2>
                      <div className="flex items-center gap-2 text-default-500 text-small">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getSystemUserStatusColorMap[user.status]}-100 text-${getSystemUserStatusColorMap[user.status]}-700`}
                        >
                          {user.status}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getSystemUserRoleColorMap[user.role]}-100 text-${getSystemUserRoleColorMap[user.role]}-700`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-medium font-semibold border-b pb-2">
                        Contact Information
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Icon
                            icon="lucide:mail"
                            className="text-default-500 mt-0.5"
                          />
                          <div>
                            <p className="text-small text-default-500">Email</p>
                            <p>{user.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Icon
                            icon="lucide:phone"
                            className="text-default-500 mt-0.5"
                          />
                          <div>
                            <p className="text-small text-default-500">Phone</p>
                            <p>
                              {user.phoneNumber
                                ? `+63${user.phoneNumber}`
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Icon
                            icon="lucide:map-pin"
                            className="text-default-500 mt-0.5"
                          />
                          <div>
                            <p className="text-small text-default-500">
                              Address
                            </p>
                            {user.address ? (
                              <p>
                                {user.address.street},
                                <br />
                                {user.address.city}
                              </p>
                            ) : (
                              <p>N/A</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-medium font-semibold border-b pb-2">
                        Personal Details
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Icon
                            icon="lucide:id-card"
                            className="text-default-500 mt-0.5"
                          />
                          <div>
                            <p className="text-small text-default-500">
                              User ID
                            </p>
                            <p className="font-mono text-small">{user.id}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Icon
                            icon="lucide:calendar"
                            className="text-default-500 mt-0.5"
                          />
                          <div>
                            <p className="text-small text-default-500">
                              Birth Date
                            </p>
                            <p>
                              {user.birthDate
                                ? formatDate(user.birthDate, "MMMM dd, yyyy")
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Icon
                            icon="lucide:user"
                            className="text-default-500 mt-0.5"
                          />
                          <div>
                            <p className="text-small text-default-500">
                              Gender
                            </p>
                            <p>{user.gender || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      {/*<h3 className="text-medium font-semibold border-b pb-2 mt-6">
                      Account Information
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Icon
                          icon="lucide:check-circle"
                          className="text-default-500 mt-0.5"
                        />
                        <div>
                          <p className="text-small text-default-500">
                            Verified At
                          </p>
                          <p>{formatDate(user.verifiedAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Icon
                          icon="lucide:clock"
                          className="text-default-500 mt-0.5"
                        />
                        <div>
                          <p className="text-small text-default-500">
                            Created At
                          </p>
                          <p>{formatDate(user.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Icon
                          icon="lucide:refresh-cw"
                          className="text-default-500 mt-0.5"
                        />
                        <div>
                          <p className="text-small text-default-500">
                            Last Updated
                          </p>
                          <p>{formatDate(user.updatedAt)}</p>
                        </div>
                      </div>
                    </div>*/}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Edit User
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
}
