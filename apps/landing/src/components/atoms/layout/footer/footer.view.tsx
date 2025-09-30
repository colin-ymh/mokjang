import styled from 'styled-components';
import { BLACK, CURSOR, MEDIA_MAX_WIDTH, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { useScopedI18n } from '../../../../../locales/client';

const FooterContainer = styled.footer`
  display: flex;
  height: 350px;
  background-color: ${BLACK};
  flex-shrink: 0;
  padding: 50px 100px;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    padding: 20px;
    height: auto;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ColumnContainer = styled.div<{ flex: number }>`
  flex: ${({ flex }) => flex};
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const RowLine = styled.div`
  display: flex;
  width: 100%;
  height: 1px;
  background-color: ${WHITE};
  margin: 50px 0 30px 0;

  transform: scaleY(0.3); // 세로 두께 축소
  transform-origin: center;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    margin: 20px 0;
  }
`;

const ColumnList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RowList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`;

export type FooterViewProps = {
  onClickCollectionLink: () => void;
  onClickTermLink: () => void;
};

const FooterView = ({
  onClickCollectionLink,
  onClickTermLink,
}: FooterViewProps) => {
  const t_footer = useScopedI18n('footer');

  return (
    <>
      <FooterContainer>
        <Wrapper>
          <ContentContainer>
            <ColumnContainer flex={2}>
              <TitleContainer>
                <MainText color={WHITE} fontSize={22} fontWeight={600}>
                  {t_footer('title')}
                </MainText>
                <MainText color={WHITE} fontSize={14} fontWeight={300}>
                  {t_footer('description')}
                </MainText>
              </TitleContainer>
              <ColumnList>
                <RowContainer>
                  <MainText color={WHITE} fontSize={14} fontWeight={600}>
                    {t_footer('company.title')}
                  </MainText>
                  <MainText color={WHITE} fontSize={14} fontWeight={300}>
                    {t_footer('company.description')}
                  </MainText>
                </RowContainer>
                <RowContainer>
                  <MainText color={WHITE} fontSize={14} fontWeight={600}>
                    {t_footer('representative.title')}
                  </MainText>
                  <MainText color={WHITE} fontSize={14} fontWeight={300}>
                    {t_footer('representative.description')}
                  </MainText>
                </RowContainer>
                <RowContainer>
                  <MainText color={WHITE} fontSize={14} fontWeight={600}>
                    {t_footer('identifyNumber.title')}
                  </MainText>
                  <MainText color={WHITE} fontSize={14} fontWeight={300}>
                    {t_footer('identifyNumber.description')}
                  </MainText>
                </RowContainer>
                <RowContainer>
                  <MainText color={WHITE} fontSize={14} fontWeight={600}>
                    {t_footer('address.title')}
                  </MainText>
                  <MainText
                    color={WHITE}
                    fontSize={14}
                    fontWeight={300}
                    whiteSpace={'normal'}
                  >
                    {t_footer('address.description')}
                  </MainText>
                </RowContainer>
              </ColumnList>
            </ColumnContainer>
            {/*<ColumnContainer flex={1}>*/}
            {/*<MainText color={WHITE} fontSize={18} fontWeight={600}>*/}
            {/*  {'서비스'}*/}
            {/*</MainText>*/}
            {/*<ColumnList>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'교인관리'}*/}
            {/*  </MainText>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'일정관리'}*/}
            {/*  </MainText>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'출석관리'}*/}
            {/*  </MainText>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'요금제'}*/}
            {/*  </MainText>*/}
            {/*</ColumnList>*/}
            {/*</ColumnContainer>*/}
            {/*<ColumnContainer flex={1}>*/}
            {/*<MainText color={WHITE} fontSize={18} fontWeight={600}>*/}
            {/*  {'고객지원'}*/}
            {/*</MainText>*/}
            {/*<ColumnList>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'문의하기'}*/}
            {/*  </MainText>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'자주묻는질문'}*/}
            {/*  </MainText>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'이메일 지원'}*/}
            {/*  </MainText>*/}
            {/*  <MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
            {/*    {'전화 지원'}*/}
            {/*  </MainText>*/}
            {/*</ColumnList>*/}
            {/*</ColumnContainer>*/}
          </ContentContainer>
          <RowLine />
          <ContentContainer>
            <RowList>
              <MainText
                color={WHITE}
                fontSize={14}
                fontWeight={300}
                onClick={onClickCollectionLink}
                cursor={CURSOR.POINTER}
              >
                {t_footer('privacyPolicy')}
              </MainText>
              <MainText
                color={WHITE}
                fontSize={14}
                fontWeight={300}
                onClick={onClickTermLink}
                cursor={CURSOR.POINTER}
              >
                {t_footer('termsOfService')}
              </MainText>
              {/*<MainText color={WHITE} fontSize={14} fontWeight={300}>*/}
              {/*  {t_footer('legalNotice')}*/}
              {/*</MainText>*/}
            </RowList>
            <MainText color={WHITE} fontSize={14} fontWeight={300}>
              {t_footer('right')}
            </MainText>
          </ContentContainer>
        </Wrapper>
      </FooterContainer>
    </>
  );
};

export default FooterView;
