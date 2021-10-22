/* Generated by restful-react */

import React from "react";
import { Get, GetProps, useGet, UseGetProps, Mutate, MutateProps, useMutate, UseMutateProps } from "restful-react";
export const SPEC_VERSION = "1.0.0"; 
export type ProfileType = "stakeholder" | "admin" | "unit owner";

export type RecordStatus = "active" | "inactive";

export interface AuthProfile {
  remarks?: string;
  scopes?: string;
  status: RecordStatus;
  type: ProfileType;
  mobileNumber?: string;
  email: string;
  username: string;
  name: string;
  id: number;
}

export interface AuthResult {
  token: string;
  profile: AuthProfile;
}

export interface CommunityAttr {
  description: string;
}

export type ChargeType = "unit" | "percentage" | "amount";

export type PostingType = "monthly" | "manual" | "accrued" | "interest";

export interface ChargeAttr {
  id?: number;
  communityId: number;
  community?: CommunityAttr;
  code: string;
  rate: number;
  chargeType: ChargeType;
  postingType: PostingType;
  thresholdInMonths?: number | null;
  priority?: number | null;
  passOn?: boolean | null;
}

export interface FieldError {
  value: string | null;
  field: string | null;
  type: string | null;
  message: string;
}

export interface EntityError {
  name: string;
  message: string;
  stack?: string;
  status: number;
  fieldErrors?: FieldError[];
}

export interface RegisterProfile {
  mobileNumber?: string;
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface ApiError {
  name: string;
  message: string;
  stack?: string;
  status: number;
}

export interface UpdateProfile {
  remarks?: string | null;
  scopes?: string;
  status: RecordStatus;
  type: ProfileType;
  mobileNumber?: string;
  email: string;
  name: string;
}

export interface PropertyAttr {
  id?: number;
  code: string;
  floorArea: number;
  address: string;
  status: RecordStatus;
}

export interface ProfileAttr {
  id?: number;
  name: string;
  username: string;
  password: string;
  email: string;
  mobileNumber?: string;
  type: ProfileType;
  status: RecordStatus;
  scopes?: string;
  remarks?: string;
}

export type TransactionType = "charged" | "collected";

export type PaymentType = "cash" | "check";

export interface PaymentDetailAttr {
  id?: number;
  collectedBy: number;
  orNumber: string;
  paymentType: PaymentType;
  checkNumber?: string;
  checkPostingDate?: string;
  checkIssuingBank?: string;
}

export interface TransactionAttr {
  id?: number;
  chargeId: number;
  charge?: ChargeAttr;
  propertyId: number;
  property?: PropertyAttr;
  amount: number;
  transactionPeriod: string;
  transactionType: TransactionType;
  waivedBy?: number;
  comments?: string;
  paymentDetailId?: number;
  paymentDetail?: PaymentDetailAttr;
  rateSnapshot?: number;
  batchId?: string | null;
}

export interface PropertyAccount {
  balance: number;
  propertyId: number;
  property?: PropertyAttr;
  assignedProfiles?: ProfileAttr[];
  transactions?: TransactionAttr[];
  paymentDetails?: PaymentDetailAttr[];
}

export type Month = "JAN" | "FEB" | "MAR" | "APR" | "MAY" | "JUN" | "JUL" | "AUG" | "SEP" | "OCT" | "NOV" | "DEC";

export interface PropertyAssignmentAttr {
  profileId: number;
  propertyId: number;
  profile?: ProfileAttr;
  property?: PropertyAttr;
}

export interface SettingAttr {
  key: string;
  value: string;
}

export interface PostTransactionBody {
  propertyId: number;
  month: Month;
  year: number;
}

export interface PostCollectionBody {
  transactions: TransactionAttr[];
  paymentDetail: PaymentDetailAttr;
}

export interface Period {
  month: Month;
  year: number;
}

export type AuthProps = Omit<MutateProps<AuthResult, unknown, void, void, void>, "path" | "verb">;

export const Auth = (props: AuthProps) => (
  <Mutate<AuthResult, unknown, void, void, void>
    verb="POST"
    path={`/api/auth`}
    
    {...props}
  />
);

export type UseAuthProps = Omit<UseMutateProps<AuthResult, unknown, void, void, void>, "path" | "verb">;

export const useAuth = (props: UseAuthProps) => useMutate<AuthResult, unknown, void, void, void>("POST", `/api/auth`, props);


export type GetAllChargesProps = Omit<GetProps<ChargeAttr[], unknown, void, void>, "path">;

export const GetAllCharges = (props: GetAllChargesProps) => (
  <Get<ChargeAttr[], unknown, void, void>
    path={`/api/charge/getAllCharges`}
    
    {...props}
  />
);

export type UseGetAllChargesProps = Omit<UseGetProps<ChargeAttr[], unknown, void, void>, "path">;

export const useGetAllCharges = (props: UseGetAllChargesProps) => useGet<ChargeAttr[], unknown, void, void>(`/api/charge/getAllCharges`, props);


export type PatchChargesProps = Omit<MutateProps<void, unknown, void, ChargeAttr[], void>, "path" | "verb">;

export const PatchCharges = (props: PatchChargesProps) => (
  <Mutate<void, unknown, void, ChargeAttr[], void>
    verb="PATCH"
    path={`/api/charge/patchCharges`}
    
    {...props}
  />
);

export type UsePatchChargesProps = Omit<UseMutateProps<void, unknown, void, ChargeAttr[], void>, "path" | "verb">;

export const usePatchCharges = (props: UsePatchChargesProps) => useMutate<void, unknown, void, ChargeAttr[], void>("PATCH", `/api/charge/patchCharges`, props);


export interface GetAllProfilesQueryParams {
  search?: string;
}

export type GetAllProfilesProps = Omit<GetProps<AuthProfile[], unknown, GetAllProfilesQueryParams, void>, "path">;

export const GetAllProfiles = (props: GetAllProfilesProps) => (
  <Get<AuthProfile[], unknown, GetAllProfilesQueryParams, void>
    path={`/api/profile/getAll`}
    
    {...props}
  />
);

export type UseGetAllProfilesProps = Omit<UseGetProps<AuthProfile[], unknown, GetAllProfilesQueryParams, void>, "path">;

export const useGetAllProfiles = (props: UseGetAllProfilesProps) => useGet<AuthProfile[], unknown, GetAllProfilesQueryParams, void>(`/api/profile/getAll`, props);


export type RegisterProps = Omit<MutateProps<AuthResult, EntityError, void, RegisterProfile, void>, "path" | "verb">;

export const Register = (props: RegisterProps) => (
  <Mutate<AuthResult, EntityError, void, RegisterProfile, void>
    verb="POST"
    path={`/api/profile/register`}
    
    {...props}
  />
);

export type UseRegisterProps = Omit<UseMutateProps<AuthResult, EntityError, void, RegisterProfile, void>, "path" | "verb">;

export const useRegister = (props: UseRegisterProps) => useMutate<AuthResult, EntityError, void, RegisterProfile, void>("POST", `/api/profile/register`, props);


export type MeProps = Omit<GetProps<AuthProfile, unknown, void, void>, "path">;

export const Me = (props: MeProps) => (
  <Get<AuthProfile, unknown, void, void>
    path={`/api/profile/me`}
    
    {...props}
  />
);

export type UseMeProps = Omit<UseGetProps<AuthProfile, unknown, void, void>, "path">;

export const useMe = (props: UseMeProps) => useGet<AuthProfile, unknown, void, void>(`/api/profile/me`, props);


export interface UpdateProfileStatusQueryParams {
  status: RecordStatus;
}

export interface UpdateProfileStatusPathParams {
  id: number
}

export type UpdateProfileStatusProps = Omit<MutateProps<void, unknown, UpdateProfileStatusQueryParams, void, UpdateProfileStatusPathParams>, "path" | "verb"> & UpdateProfileStatusPathParams;

export const UpdateProfileStatus = ({id, ...props}: UpdateProfileStatusProps) => (
  <Mutate<void, unknown, UpdateProfileStatusQueryParams, void, UpdateProfileStatusPathParams>
    verb="PATCH"
    path={`/api/profile/updateProfileStatus/${id}`}
    
    {...props}
  />
);

export type UseUpdateProfileStatusProps = Omit<UseMutateProps<void, unknown, UpdateProfileStatusQueryParams, void, UpdateProfileStatusPathParams>, "path" | "verb"> & UpdateProfileStatusPathParams;

export const useUpdateProfileStatus = ({id, ...props}: UseUpdateProfileStatusProps) => useMutate<void, unknown, UpdateProfileStatusQueryParams, void, UpdateProfileStatusPathParams>("PATCH", (paramsInPath: UpdateProfileStatusPathParams) => `/api/profile/updateProfileStatus/${paramsInPath.id}`, {  pathParams: { id }, ...props });


export interface UpdateProfilePathParams {
  id: number
}

export type UpdateProfileProps = Omit<MutateProps<AuthProfile, EntityError | ApiError, void, UpdateProfile, UpdateProfilePathParams>, "path" | "verb"> & UpdateProfilePathParams;

export const UpdateProfile = ({id, ...props}: UpdateProfileProps) => (
  <Mutate<AuthProfile, EntityError | ApiError, void, UpdateProfile, UpdateProfilePathParams>
    verb="PATCH"
    path={`/api/profile/updateProfile/${id}`}
    
    {...props}
  />
);

export type UseUpdateProfileProps = Omit<UseMutateProps<AuthProfile, EntityError | ApiError, void, UpdateProfile, UpdateProfilePathParams>, "path" | "verb"> & UpdateProfilePathParams;

export const useUpdateProfile = ({id, ...props}: UseUpdateProfileProps) => useMutate<AuthProfile, EntityError | ApiError, void, UpdateProfile, UpdateProfilePathParams>("PATCH", (paramsInPath: UpdateProfilePathParams) => `/api/profile/updateProfile/${paramsInPath.id}`, {  pathParams: { id }, ...props });


export interface ChangePasswordPathParams {
  id: number
}

export interface ChangePasswordRequestBody {
  newPassword: string;
  currentPassword: string;
}

export type ChangePasswordProps = Omit<MutateProps<void, unknown, void, ChangePasswordRequestBody, ChangePasswordPathParams>, "path" | "verb"> & ChangePasswordPathParams;

export const ChangePassword = ({id, ...props}: ChangePasswordProps) => (
  <Mutate<void, unknown, void, ChangePasswordRequestBody, ChangePasswordPathParams>
    verb="PATCH"
    path={`/api/profile/changePassword/${id}`}
    
    {...props}
  />
);

export type UseChangePasswordProps = Omit<UseMutateProps<void, unknown, void, ChangePasswordRequestBody, ChangePasswordPathParams>, "path" | "verb"> & ChangePasswordPathParams;

export const useChangePassword = ({id, ...props}: UseChangePasswordProps) => useMutate<void, unknown, void, ChangePasswordRequestBody, ChangePasswordPathParams>("PATCH", (paramsInPath: ChangePasswordPathParams) => `/api/profile/changePassword/${paramsInPath.id}`, {  pathParams: { id }, ...props });


export interface GetPropertyAccountsByProfilePathParams {
  profileId: number
}

export type GetPropertyAccountsByProfileProps = Omit<GetProps<PropertyAccount[], unknown, void, GetPropertyAccountsByProfilePathParams>, "path"> & GetPropertyAccountsByProfilePathParams;

export const GetPropertyAccountsByProfile = ({profileId, ...props}: GetPropertyAccountsByProfileProps) => (
  <Get<PropertyAccount[], unknown, void, GetPropertyAccountsByProfilePathParams>
    path={`/api/property-account/getPropertyAccountsByProfile/${profileId}`}
    
    {...props}
  />
);

export type UseGetPropertyAccountsByProfileProps = Omit<UseGetProps<PropertyAccount[], unknown, void, GetPropertyAccountsByProfilePathParams>, "path"> & GetPropertyAccountsByProfilePathParams;

export const useGetPropertyAccountsByProfile = ({profileId, ...props}: UseGetPropertyAccountsByProfileProps) => useGet<PropertyAccount[], unknown, void, GetPropertyAccountsByProfilePathParams>((paramsInPath: GetPropertyAccountsByProfilePathParams) => `/api/property-account/getPropertyAccountsByProfile/${paramsInPath.profileId}`, {  pathParams: { profileId }, ...props });


export interface GetPropertyAccountQueryParams {
  year?: number;
  month?: Month;
}

export interface GetPropertyAccountPathParams {
  propertyId: number
}

export type GetPropertyAccountProps = Omit<GetProps<PropertyAccount, unknown, GetPropertyAccountQueryParams, GetPropertyAccountPathParams>, "path"> & GetPropertyAccountPathParams;

export const GetPropertyAccount = ({propertyId, ...props}: GetPropertyAccountProps) => (
  <Get<PropertyAccount, unknown, GetPropertyAccountQueryParams, GetPropertyAccountPathParams>
    path={`/api/property-account/getPropertyAccount/${propertyId}`}
    
    {...props}
  />
);

export type UseGetPropertyAccountProps = Omit<UseGetProps<PropertyAccount, unknown, GetPropertyAccountQueryParams, GetPropertyAccountPathParams>, "path"> & GetPropertyAccountPathParams;

export const useGetPropertyAccount = ({propertyId, ...props}: UseGetPropertyAccountProps) => useGet<PropertyAccount, unknown, GetPropertyAccountQueryParams, GetPropertyAccountPathParams>((paramsInPath: GetPropertyAccountPathParams) => `/api/property-account/getPropertyAccount/${paramsInPath.propertyId}`, {  pathParams: { propertyId }, ...props });


export interface GetPropertyAccountsByPeriodQueryParams {
  year?: number;
  month?: Month;
}

export type GetPropertyAccountsByPeriodProps = Omit<GetProps<PropertyAccount[], unknown, GetPropertyAccountsByPeriodQueryParams, void>, "path">;

export const GetPropertyAccountsByPeriod = (props: GetPropertyAccountsByPeriodProps) => (
  <Get<PropertyAccount[], unknown, GetPropertyAccountsByPeriodQueryParams, void>
    path={`/api/property-account/getPropertyAccountsByPeriod`}
    
    {...props}
  />
);

export type UseGetPropertyAccountsByPeriodProps = Omit<UseGetProps<PropertyAccount[], unknown, GetPropertyAccountsByPeriodQueryParams, void>, "path">;

export const useGetPropertyAccountsByPeriod = (props: UseGetPropertyAccountsByPeriodProps) => useGet<PropertyAccount[], unknown, GetPropertyAccountsByPeriodQueryParams, void>(`/api/property-account/getPropertyAccountsByPeriod`, props);


export interface GetAllPropertiesQueryParams {
  search?: string;
}

export type GetAllPropertiesProps = Omit<GetProps<PropertyAttr[], unknown, GetAllPropertiesQueryParams, void>, "path">;

export const GetAllProperties = (props: GetAllPropertiesProps) => (
  <Get<PropertyAttr[], unknown, GetAllPropertiesQueryParams, void>
    path={`/api/property/getAll`}
    
    {...props}
  />
);

export type UseGetAllPropertiesProps = Omit<UseGetProps<PropertyAttr[], unknown, GetAllPropertiesQueryParams, void>, "path">;

export const useGetAllProperties = (props: UseGetAllPropertiesProps) => useGet<PropertyAttr[], unknown, GetAllPropertiesQueryParams, void>(`/api/property/getAll`, props);


export interface GetPropertyPathParams {
  id: number
}

export type GetPropertyProps = Omit<GetProps<PropertyAttr, unknown, void, GetPropertyPathParams>, "path"> & GetPropertyPathParams;

export const GetProperty = ({id, ...props}: GetPropertyProps) => (
  <Get<PropertyAttr, unknown, void, GetPropertyPathParams>
    path={`/api/property/${id}`}
    
    {...props}
  />
);

export type UseGetPropertyProps = Omit<UseGetProps<PropertyAttr, unknown, void, GetPropertyPathParams>, "path"> & GetPropertyPathParams;

export const useGetProperty = ({id, ...props}: UseGetPropertyProps) => useGet<PropertyAttr, unknown, void, GetPropertyPathParams>((paramsInPath: GetPropertyPathParams) => `/api/property/${paramsInPath.id}`, {  pathParams: { id }, ...props });


export interface GetPropertyAssignmentsPathParams {
  propertyId: number
}

export type GetPropertyAssignmentsProps = Omit<GetProps<PropertyAssignmentAttr[], unknown, void, GetPropertyAssignmentsPathParams>, "path"> & GetPropertyAssignmentsPathParams;

export const GetPropertyAssignments = ({propertyId, ...props}: GetPropertyAssignmentsProps) => (
  <Get<PropertyAssignmentAttr[], unknown, void, GetPropertyAssignmentsPathParams>
    path={`/api/property/getPropertyAssignments/${propertyId}`}
    
    {...props}
  />
);

export type UseGetPropertyAssignmentsProps = Omit<UseGetProps<PropertyAssignmentAttr[], unknown, void, GetPropertyAssignmentsPathParams>, "path"> & GetPropertyAssignmentsPathParams;

export const useGetPropertyAssignments = ({propertyId, ...props}: UseGetPropertyAssignmentsProps) => useGet<PropertyAssignmentAttr[], unknown, void, GetPropertyAssignmentsPathParams>((paramsInPath: GetPropertyAssignmentsPathParams) => `/api/property/getPropertyAssignments/${paramsInPath.propertyId}`, {  pathParams: { propertyId }, ...props });


export interface GetAssignedPropertiesPathParams {
  profileId: number
}

export type GetAssignedPropertiesProps = Omit<GetProps<PropertyAssignmentAttr[], unknown, void, GetAssignedPropertiesPathParams>, "path"> & GetAssignedPropertiesPathParams;

export const GetAssignedProperties = ({profileId, ...props}: GetAssignedPropertiesProps) => (
  <Get<PropertyAssignmentAttr[], unknown, void, GetAssignedPropertiesPathParams>
    path={`/api/property/getAssignedProperties/${profileId}`}
    
    {...props}
  />
);

export type UseGetAssignedPropertiesProps = Omit<UseGetProps<PropertyAssignmentAttr[], unknown, void, GetAssignedPropertiesPathParams>, "path"> & GetAssignedPropertiesPathParams;

export const useGetAssignedProperties = ({profileId, ...props}: UseGetAssignedPropertiesProps) => useGet<PropertyAssignmentAttr[], unknown, void, GetAssignedPropertiesPathParams>((paramsInPath: GetAssignedPropertiesPathParams) => `/api/property/getAssignedProperties/${paramsInPath.profileId}`, {  pathParams: { profileId }, ...props });


export type CreatePropertyProps = Omit<MutateProps<PropertyAttr, EntityError, void, PropertyAttr, void>, "path" | "verb">;

export const CreateProperty = (props: CreatePropertyProps) => (
  <Mutate<PropertyAttr, EntityError, void, PropertyAttr, void>
    verb="POST"
    path={`/api/property/create`}
    
    {...props}
  />
);

export type UseCreatePropertyProps = Omit<UseMutateProps<PropertyAttr, EntityError, void, PropertyAttr, void>, "path" | "verb">;

export const useCreateProperty = (props: UseCreatePropertyProps) => useMutate<PropertyAttr, EntityError, void, PropertyAttr, void>("POST", `/api/property/create`, props);


export interface UpdatePropertyStatusQueryParams {
  status: RecordStatus;
}

export interface UpdatePropertyStatusPathParams {
  id: number
}

export type UpdatePropertyStatusProps = Omit<MutateProps<void, unknown, UpdatePropertyStatusQueryParams, void, UpdatePropertyStatusPathParams>, "path" | "verb"> & UpdatePropertyStatusPathParams;

export const UpdatePropertyStatus = ({id, ...props}: UpdatePropertyStatusProps) => (
  <Mutate<void, unknown, UpdatePropertyStatusQueryParams, void, UpdatePropertyStatusPathParams>
    verb="PATCH"
    path={`/api/property/updatePropertyStatus/${id}`}
    
    {...props}
  />
);

export type UseUpdatePropertyStatusProps = Omit<UseMutateProps<void, unknown, UpdatePropertyStatusQueryParams, void, UpdatePropertyStatusPathParams>, "path" | "verb"> & UpdatePropertyStatusPathParams;

export const useUpdatePropertyStatus = ({id, ...props}: UseUpdatePropertyStatusProps) => useMutate<void, unknown, UpdatePropertyStatusQueryParams, void, UpdatePropertyStatusPathParams>("PATCH", (paramsInPath: UpdatePropertyStatusPathParams) => `/api/property/updatePropertyStatus/${paramsInPath.id}`, {  pathParams: { id }, ...props });


export interface UpdatePropertyPathParams {
  id: number
}

export type UpdatePropertyProps = Omit<MutateProps<PropertyAttr, EntityError | ApiError, void, PropertyAttr, UpdatePropertyPathParams>, "path" | "verb"> & UpdatePropertyPathParams;

export const UpdateProperty = ({id, ...props}: UpdatePropertyProps) => (
  <Mutate<PropertyAttr, EntityError | ApiError, void, PropertyAttr, UpdatePropertyPathParams>
    verb="PATCH"
    path={`/api/property/updateProperty/${id}`}
    
    {...props}
  />
);

export type UseUpdatePropertyProps = Omit<UseMutateProps<PropertyAttr, EntityError | ApiError, void, PropertyAttr, UpdatePropertyPathParams>, "path" | "verb"> & UpdatePropertyPathParams;

export const useUpdateProperty = ({id, ...props}: UseUpdatePropertyProps) => useMutate<PropertyAttr, EntityError | ApiError, void, PropertyAttr, UpdatePropertyPathParams>("PATCH", (paramsInPath: UpdatePropertyPathParams) => `/api/property/updateProperty/${paramsInPath.id}`, {  pathParams: { id }, ...props });


export interface UpdatePropertyAssignmentsPathParams {
  id: number
}

export type UpdatePropertyAssignmentsProps = Omit<MutateProps<void, unknown, void, number[], UpdatePropertyAssignmentsPathParams>, "path" | "verb"> & UpdatePropertyAssignmentsPathParams;

export const UpdatePropertyAssignments = ({id, ...props}: UpdatePropertyAssignmentsProps) => (
  <Mutate<void, unknown, void, number[], UpdatePropertyAssignmentsPathParams>
    verb="PATCH"
    path={`/api/property/updatePropertyAssignments/${id}`}
    
    {...props}
  />
);

export type UseUpdatePropertyAssignmentsProps = Omit<UseMutateProps<void, unknown, void, number[], UpdatePropertyAssignmentsPathParams>, "path" | "verb"> & UpdatePropertyAssignmentsPathParams;

export const useUpdatePropertyAssignments = ({id, ...props}: UseUpdatePropertyAssignmentsProps) => useMutate<void, unknown, void, number[], UpdatePropertyAssignmentsPathParams>("PATCH", (paramsInPath: UpdatePropertyAssignmentsPathParams) => `/api/property/updatePropertyAssignments/${paramsInPath.id}`, {  pathParams: { id }, ...props });


export type GetAllSettingsProps = Omit<GetProps<SettingAttr[], unknown, void, void>, "path">;

export const GetAllSettings = (props: GetAllSettingsProps) => (
  <Get<SettingAttr[], unknown, void, void>
    path={`/api/setting/getAll`}
    
    {...props}
  />
);

export type UseGetAllSettingsProps = Omit<UseGetProps<SettingAttr[], unknown, void, void>, "path">;

export const useGetAllSettings = (props: UseGetAllSettingsProps) => useGet<SettingAttr[], unknown, void, void>(`/api/setting/getAll`, props);


export interface GetSettingValueQueryParams {
  key: string;
}

export type GetSettingValueProps = Omit<GetProps<string, unknown, GetSettingValueQueryParams, void>, "path">;

export const GetSettingValue = (props: GetSettingValueProps) => (
  <Get<string, unknown, GetSettingValueQueryParams, void>
    path={`/api/setting/getSettingValue`}
    
    {...props}
  />
);

export type UseGetSettingValueProps = Omit<UseGetProps<string, unknown, GetSettingValueQueryParams, void>, "path">;

export const useGetSettingValue = (props: UseGetSettingValueProps) => useGet<string, unknown, GetSettingValueQueryParams, void>(`/api/setting/getSettingValue`, props);


export type UpdateSettingValueProps = Omit<MutateProps<void, unknown, void, SettingAttr, void>, "path" | "verb">;

export const UpdateSettingValue = (props: UpdateSettingValueProps) => (
  <Mutate<void, unknown, void, SettingAttr, void>
    verb="PATCH"
    path={`/api/setting/updateSettingValue`}
    
    {...props}
  />
);

export type UseUpdateSettingValueProps = Omit<UseMutateProps<void, unknown, void, SettingAttr, void>, "path" | "verb">;

export const useUpdateSettingValue = (props: UseUpdateSettingValueProps) => useMutate<void, unknown, void, SettingAttr, void>("PATCH", `/api/setting/updateSettingValue`, props);


export type PostMonthlyChargesProps = Omit<MutateProps<void, ApiError, void, PostTransactionBody, void>, "path" | "verb">;

export const PostMonthlyCharges = (props: PostMonthlyChargesProps) => (
  <Mutate<void, ApiError, void, PostTransactionBody, void>
    verb="POST"
    path={`/api/transaction/postMonthlyCharges`}
    
    {...props}
  />
);

export type UsePostMonthlyChargesProps = Omit<UseMutateProps<void, ApiError, void, PostTransactionBody, void>, "path" | "verb">;

export const usePostMonthlyCharges = (props: UsePostMonthlyChargesProps) => useMutate<void, ApiError, void, PostTransactionBody, void>("POST", `/api/transaction/postMonthlyCharges`, props);


export type PostCollectionsProps = Omit<MutateProps<void, EntityError, void, PostCollectionBody, void>, "path" | "verb">;

export const PostCollections = (props: PostCollectionsProps) => (
  <Mutate<void, EntityError, void, PostCollectionBody, void>
    verb="POST"
    path={`/api/transaction/postCollections`}
    
    {...props}
  />
);

export type UsePostCollectionsProps = Omit<UseMutateProps<void, EntityError, void, PostCollectionBody, void>, "path" | "verb">;

export const usePostCollections = (props: UsePostCollectionsProps) => useMutate<void, EntityError, void, PostCollectionBody, void>("POST", `/api/transaction/postCollections`, props);


export type PostTransactionsProps = Omit<MutateProps<void, unknown, void, TransactionAttr[], void>, "path" | "verb">;

export const PostTransactions = (props: PostTransactionsProps) => (
  <Mutate<void, unknown, void, TransactionAttr[], void>
    verb="POST"
    path={`/api/transaction/postTransactions`}
    
    {...props}
  />
);

export type UsePostTransactionsProps = Omit<UseMutateProps<void, unknown, void, TransactionAttr[], void>, "path" | "verb">;

export const usePostTransactions = (props: UsePostTransactionsProps) => useMutate<void, unknown, void, TransactionAttr[], void>("POST", `/api/transaction/postTransactions`, props);


export interface GetAvailablePeriodsPathParams {
  propertyId: number
}

export type GetAvailablePeriodsProps = Omit<GetProps<Period[], unknown, void, GetAvailablePeriodsPathParams>, "path"> & GetAvailablePeriodsPathParams;

export const GetAvailablePeriods = ({propertyId, ...props}: GetAvailablePeriodsProps) => (
  <Get<Period[], unknown, void, GetAvailablePeriodsPathParams>
    path={`/api/transaction/getAvailablePeriods/${propertyId}`}
    
    {...props}
  />
);

export type UseGetAvailablePeriodsProps = Omit<UseGetProps<Period[], unknown, void, GetAvailablePeriodsPathParams>, "path"> & GetAvailablePeriodsPathParams;

export const useGetAvailablePeriods = ({propertyId, ...props}: UseGetAvailablePeriodsProps) => useGet<Period[], unknown, void, GetAvailablePeriodsPathParams>((paramsInPath: GetAvailablePeriodsPathParams) => `/api/transaction/getAvailablePeriods/${paramsInPath.propertyId}`, {  pathParams: { propertyId }, ...props });


export interface SuggestPaymentBreakdownQueryParams {
  amount: number;
  year: number;
  month: Month;
}

export interface SuggestPaymentBreakdownPathParams {
  propertyId: number
}

export type SuggestPaymentBreakdownProps = Omit<GetProps<TransactionAttr[], unknown, SuggestPaymentBreakdownQueryParams, SuggestPaymentBreakdownPathParams>, "path"> & SuggestPaymentBreakdownPathParams;

export const SuggestPaymentBreakdown = ({propertyId, ...props}: SuggestPaymentBreakdownProps) => (
  <Get<TransactionAttr[], unknown, SuggestPaymentBreakdownQueryParams, SuggestPaymentBreakdownPathParams>
    path={`/api/transaction/suggestPaymentBreakdown/${propertyId}`}
    
    {...props}
  />
);

export type UseSuggestPaymentBreakdownProps = Omit<UseGetProps<TransactionAttr[], unknown, SuggestPaymentBreakdownQueryParams, SuggestPaymentBreakdownPathParams>, "path"> & SuggestPaymentBreakdownPathParams;

export const useSuggestPaymentBreakdown = ({propertyId, ...props}: UseSuggestPaymentBreakdownProps) => useGet<TransactionAttr[], unknown, SuggestPaymentBreakdownQueryParams, SuggestPaymentBreakdownPathParams>((paramsInPath: SuggestPaymentBreakdownPathParams) => `/api/transaction/suggestPaymentBreakdown/${paramsInPath.propertyId}`, {  pathParams: { propertyId }, ...props });

