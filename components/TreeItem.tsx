import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@stitches/react';
import { violet, mauve, blackA, whiteA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { RootState } from "../store";
import { updateTokenTypeStatus } from '../store/tokenTypeStatusState';

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 24,
  height: 13,
  backgroundColor: '#7e7e7e',
  borderRadius: '9999px',
  border: 'solid 1px',
  position: 'relative',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&:focus': { boxShadow: `0 0 0 1px black` },
  '&[data-state="checked"]': { backgroundColor: 'rgb(255,255,255)' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 15,
  height: 15,
  backgroundColor: 'white',
  borderRadius: '9999px',
  border: 'solid 0.7px',
  transition: 'transform 100ms',
  transform: 'translate(10px, -1px)',
  willChange: 'transform',
  '&[data-state="unchecked"]': { transform: 'translate(-1px, -1px)' },
});

// Exports
export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;

// Your app...
const Flex = styled('div', { display: 'flex', order:0, flexGrow: 0, marginTop: 15 });
const Label = styled('label', {
  color: 'black',
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
});

type Props = {
  tokenType?: string;
}

const TreeItem: React.FC<Props> = ({
  tokenType
}) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = React.useState(false);
  const tokenTypeChecked = useSelector((state: RootState) => (state.tokenType));

  const handleSwithcClicked = React.useCallback(() => {
    dispatch(updateTokenTypeStatus({name: tokenType}));
    setIsChecked(!isChecked);
  }, [isChecked]);

  useEffect(() => {
    Object.entries(tokenTypeChecked).forEach(t => {
      if(t[0] === tokenType){
        setIsChecked(t[1]);
    }
  })
  }, [isChecked]);
  return (
    <form>
      <Flex css={{ alignItems: 'center' }}>
        <Switch checked={!isChecked} id="s1" onCheckedChange={handleSwithcClicked} >
          <SwitchThumb />
        </Switch>
        <Label htmlFor="s1" css={{ paddingLeft: 10 }}>
          {tokenType}
        </Label>
      </Flex>
    </form>
  );
}
export default TreeItem;