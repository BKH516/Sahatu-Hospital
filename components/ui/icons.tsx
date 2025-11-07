import React from 'react';
import {
  User,
  Briefcase,
  Calendar,
  Clock,
  Plus,
  Edit,
  Building2,
  X,
  Home,
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Modern icon components with consistent styling
export const UserIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <User ref={ref} {...props} />
);
UserIcon.displayName = 'UserIcon';

export const BriefcaseIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Briefcase ref={ref} {...props} />
);
BriefcaseIcon.displayName = 'BriefcaseIcon';

export const CalendarIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Calendar ref={ref} {...props} />
);
CalendarIcon.displayName = 'CalendarIcon';

export const ClockIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Clock ref={ref} {...props} />
);
ClockIcon.displayName = 'ClockIcon';

export const PlusCircleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Plus ref={ref} {...props} />
);
PlusCircleIcon.displayName = 'PlusCircleIcon';

export const EditIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Edit ref={ref} {...props} />
);
EditIcon.displayName = 'EditIcon';

export const HospitalIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Building2 ref={ref} {...props} />
);
HospitalIcon.displayName = 'HospitalIcon';

export const CloseIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <X ref={ref} {...props} />
);
CloseIcon.displayName = 'CloseIcon';

export const HomeIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Home ref={ref} {...props} />
);
HomeIcon.displayName = 'HomeIcon';

export const SettingsIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <Settings ref={ref} {...props} />
);
SettingsIcon.displayName = 'SettingsIcon';

export const DocumentTextIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <FileText ref={ref} {...props} />
);
DocumentTextIcon.displayName = 'DocumentTextIcon';

export const AlertCircleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <AlertCircle ref={ref} {...props} />
);
AlertCircleIcon.displayName = 'AlertCircleIcon';

export const CheckCircleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <CheckCircle ref={ref} {...props} />
);
CheckCircleIcon.displayName = 'CheckCircleIcon';

export const XCircleIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => <XCircle ref={ref} {...props} />
);
XCircleIcon.displayName = 'XCircleIcon';
